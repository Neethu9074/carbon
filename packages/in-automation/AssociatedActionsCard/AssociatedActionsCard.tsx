/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { useState } from 'react';

import { useObservable } from '@instana/hooks';

import {
  getCustomEventActions,
  getBuiltinEventActions,
  getBuiltInEventSpecificationMutable,
  updateActionsAssignedToBuiltInEvent,
  saveCustomEventSpecificationWithActions,
  getCustomEventSpecificationMutable
} from 'in-api/eventSpecifications';
import createMemoizedObservableForReferencedEntities from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Alerts/components/memoizeReferencedEntitiesObservable';
import {
  getScoredActionsForEventOrAlert,
  EventSpecification,
  getAllActionsWithAISuggestions,
  getAllActions
} from 'in-automation/api';
import SelectListDialogButton from 'in-settings/tabs/TeamSettings/components/SelectListDialogButton';
import { VolatileId, Action, Event, CustomEventSpecificationWithMetadata } from 'in-types';
import ActionTable, { ActionTableProps } from 'in-automation/ActionCatalog/ActionTable';
import { deleteActionAssociationTracker } from 'in-automation/tracker';
import { LoadingIndicator } from 'in-components/LoadingIndicators';
import { associateActionsTracker } from 'in-automation/tracker';
import { close } from 'in-components/DialogPresenter/store';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

interface AssociatedActionsCardProps {
  event: Event;
  volatileId: VolatileId;
  title?: string;
}

function getObservables(isCustomEvent: boolean) {
  return {
    getEventSpecification: isCustomEvent ? getCustomEventSpecificationMutable : getBuiltInEventSpecificationMutable,
    getActionsForEventSpecification: isCustomEvent ? getCustomEventActions : getBuiltinEventActions
  };
}

function useAssociatedActionsData(eventSpecificationId: string, isCustomEvent: boolean) {
  const [reload, triggerReload] = useState<number>(0);
  const { getEventSpecification, getActionsForEventSpecification } = getObservables(isCustomEvent);
  const actions =
    useObservable<Action[], [string, number]>(
      () => getActionsForEventSpecification(eventSpecificationId),
      [eventSpecificationId, reload]
    ) ?? [];

  const eventSpecification = useObservable<EventSpecification, [string]>(
    () => getEventSpecification(eventSpecificationId),
    [eventSpecificationId]
  );
  return { actions, eventSpecification, triggerReload: () => triggerReload(Math.random()) };
}

const getIsCustomEvent = (event: AssociatedActionsCardProps['event']) =>
  (event?.metadata?.custom_issue as boolean) ?? false;
const getEventSpecificationId = (event: AssociatedActionsCardProps['event']) =>
  event?.metadata?.eventSpecificationId as string;

export default function AssociatedActionsCard({ event, volatileId, title }: AssociatedActionsCardProps) {
  const eventSpecificationId = getEventSpecificationId(event);
  const allActions = useObservable<Action[], never[]>(getAllActions, []) ?? [];
  const isCustomEvent = getIsCustomEvent(event);
  const { actions, eventSpecification, triggerReload } = useAssociatedActionsData(eventSpecificationId, isCustomEvent);

  const eventSpecificationTest = useObservable<
    CustomEventSpecificationWithMetadata,
    [EventSpecification | null | undefined]
  >(
    // () => getCustomEventSpecificationMutable(eventSpecification.id),
    eventSpecification ? getCustomEventSpecificationMutable(eventSpecification.id) : undefined,
    [eventSpecification]
  );

  const closeAndReload = () => {
    close();
    // This helps to reload the actions table
    triggerReload();
  };
  if (!eventSpecification) {
    return <LoadingIndicator size="xl" />;
  }

  const selectedActions = actions.map(action => action.id);
  const { id: eventId, name: eventName } = eventSpecification;
  const tableActions = {
    delete: {
      deleteEntity: (action: Action) => {
        deleteActionAssociationTracker({ actionName: action.name, actionType: action.type });
        const newActionsArray = actions.filter(obj => obj.id !== action.id).map(obj => obj.id);
        const convertedActionsArray = newActionsArray.map(str => {
          return { id: str };
        });
        if (isCustomEvent) {
          // getCustomEventSpecificationMutable(eventId).once(response =>
          return saveCustomEventSpecificationWithActions({ ...eventSpecificationTest, actions: convertedActionsArray });
          // );
        } else {
          return updateActionsAssignedToBuiltInEvent(convertedActionsArray, eventId);
        }
      }
    }
  };

  const getScoredActionsForEventMemoized = createMemoizedObservableForReferencedEntities(selectedActions =>
    getScoredActionsForEventOrAlert(selectedActions, eventSpecification)
  );

  function submitActionSelection(selectedIds: string[]) {
    const actionIds = actions.map(obj => obj.id);
    const newActionsArray = [...new Set(actionIds)].concat(selectedIds);
    const convertedActionsArray = newActionsArray.map(str => {
      return { id: str };
    });
    const actionNames = allActions.reduce<string[]>(
      (acc, action) => [...acc, ...(newActionsArray.includes(action.id) ? [action.name] : [])],
      []
    );

    associateActionsTracker({
      eventName,
      actionNames
    });
    if (isCustomEvent) {
      // return getCustomEventSpecificationMutable(eventId).once(response =>
      return saveCustomEventSpecificationWithActions({
        ...eventSpecificationTest,
        actions: convertedActionsArray
      }).once(closeAndReload);
      // );
    } else {
      return updateActionsAssignedToBuiltInEvent(convertedActionsArray, eventId).once(closeAndReload);
    }
  }

  function ScoredActionTable({
    eventSpecification,
    ...props
  }: Omit<ActionTableProps, 'loadEntities'> & { eventSpecification: EventSpecification }) {
    return (
      <ActionTable
        {...props}
        pageSize={5}
        loadEntities={() =>
          getAllActionsWithAISuggestions(eventSpecification.name, eventSpecification.description ?? '')
        }
        scored
      />
    );
  }
  const RightHeader = (
    <SelectListDialogButton
      onSubmit={(selectedActions: string[]) => submitActionSelection(selectedActions)}
      title={t('in-settings:tabs.addActions')}
      label={t('in-settings:tabs.addActions')}
      listComponent={(props: ActionTableProps) => (
        <ScoredActionTable {...props} eventSpecification={eventSpecification} />
      )}
      hiddenIds={selectedActions}
      createSubmitLabel={(numberOfItems: number) =>
        numberOfItems > 0
          ? t('in-settings:tabs.addNumberOfItemsAction', { count: numberOfItems })
          : t('in-settings:tabs.addActions')
      }
      requiresAtLeastOneMessage={t('in-settings:tabs.pleaseSelectAtLeastOneAction')}
    />
  );

  return (
    <ActionTable
      title={title ?? t('in-automation:associatedActions')}
      showExecuteColumn={role?.canRunAutomationActions}
      showActionLink
      getEntityName={action => t('in-automation:actionAssociationWithNameForDelete', { actionName: action.name })}
      event={event}
      tableActions={tableActions}
      rightHeader={RightHeader}
      volatileId={volatileId}
      loadEntities={() => getScoredActionsForEventMemoized(selectedActions)}
      scored
      isBeta
    />
  );
}
