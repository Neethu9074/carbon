/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { useObservable } from '@instana/hooks';

import {
  getScoredActionsForEventOrAlert,
  EventSpecification,
  getAllActionsWithAISuggestions,
  getAllActions
} from 'in-automation/api';
import {
  updateActionsAssignedToBuiltInEvent,
  saveCustomEventSpecificationWithActions
} from 'in-api/eventSpecifications';
import { getEventSpecificationId, getIsCustomEvent, useAssociatedActionsData, useDualReload } from './shared';
import SelectListDialogButton from 'in-settings/tabs/TeamSettings/components/SelectListDialogButton';
import ActionTable, { ActionTableProps } from 'in-automation/ActionCatalog/ActionTable';
import { deleteActionAssociationTracker } from 'in-automation/tracker';
import { LoadingIndicator } from 'in-components/LoadingIndicators';
import { associateActionsTracker } from 'in-automation/tracker';
import { VolatileId, Action, Event } from 'in-types';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

interface AssociatedActionsCardProps {
  event: Event;
  volatileId: VolatileId;
  title?: string;
  reload?: number;
  setReload?: (r: number) => void;
}

export default function AssociatedActionsCard({
  event,
  volatileId,
  title,
  reload: externalReload,
  setReload: setExternalReload
}: AssociatedActionsCardProps) {
  const eventSpecificationId = getEventSpecificationId(event);
  const isCustomEvent = getIsCustomEvent(event);

  const [reload, triggerReload] = useDualReload(externalReload, setExternalReload);

  const { actions, eventSpecification } = useAssociatedActionsData(eventSpecificationId, isCustomEvent, reload);

  if (!eventSpecification || !actions) {
    return <LoadingIndicator size="xl" />;
  }

  const selectedActions = (actions ?? []).map(action => action.id);

  return (
    <ActionTable
      title={title ?? t('in-automation:associatedActions')}
      showExecuteColumn={role?.canRunAutomationActions}
      showActionLink
      getEntityName={action => t('in-automation:actionAssociationWithNameForDelete', { actionName: action.name })}
      event={event}
      tableActions={{
        delete: {
          deleteEntity: action => {
            deleteActionAssociationTracker({ actionName: action.name, actionType: action.type });
            const updatedActions = actions.filter(a => a.id !== action.id).map(a => ({ id: a.id }));
            if (isCustomEvent) {
              return saveCustomEventSpecificationWithActions({ ...eventSpecification, actions: updatedActions }).tap(
                triggerReload
              );
            } else {
              return updateActionsAssignedToBuiltInEvent(updatedActions, eventSpecification.id).tap(triggerReload);
            }
          }
        }
      }}
      rightHeader={
        <RightHeader
          actions={actions ?? []}
          eventSpecification={eventSpecification}
          triggerReload={triggerReload}
          isCustomEvent={isCustomEvent}
        />
      }
      volatileId={volatileId}
      loadEntities={() => getScoredActionsForEventOrAlert(selectedActions, eventSpecification)}
      isBeta
    />
  );
}

interface RightHeaderProps {
  eventSpecification: EventSpecification;
  triggerReload: () => void;
  isCustomEvent: boolean;
  actions: Action[];
}
function RightHeader({ eventSpecification, actions, isCustomEvent, triggerReload }: RightHeaderProps) {
  const allActions = useObservable<Action[], never[]>(getAllActions, []) ?? [];
  const associatedActionIds = actions.map(a => a.id);

  function submitActionSelection(selectedIds: string[]) {
    const updatedActionIds = [...associatedActionIds, ...selectedIds];
    const updatedActions = updatedActionIds.map(id => ({ id }));
    const actionNames = allActions.reduce<string[]>(
      (acc, action) => [...acc, ...(updatedActionIds.includes(action.id) ? [action.name] : [])],
      []
    );

    associateActionsTracker({
      eventName: eventSpecification.name,
      actionNames,
      type: isCustomEvent ? 'Custom event' : 'Builtin event'
    });

    if (isCustomEvent) {
      saveCustomEventSpecificationWithActions({
        ...eventSpecification,
        actions: updatedActions
      }).once(triggerReload);
    } else {
      updateActionsAssignedToBuiltInEvent(updatedActions, eventSpecification.id).once(triggerReload);
    }
  }

  return (
    <SelectListDialogButton
      onSubmit={selectedActions => submitActionSelection(selectedActions)}
      title={t('in-settings:tabs.addActions')}
      label={t('in-settings:tabs.addActions')}
      listComponent={(props: ActionTableProps) => (
        <ActionTable
          {...props}
          loadEntities={() =>
            getAllActionsWithAISuggestions(eventSpecification.name, eventSpecification.description ?? '')
          }
          scored
        />
      )}
      hiddenIds={associatedActionIds}
      createSubmitLabel={numberOfItems =>
        numberOfItems > 0
          ? t('in-settings:tabs.addNumberOfItemsAction', { count: numberOfItems })
          : t('in-settings:tabs.addActions')
      }
      requiresAtLeastOneMessage={t('in-settings:tabs.pleaseSelectAtLeastOneAction')}
    />
  );
}
