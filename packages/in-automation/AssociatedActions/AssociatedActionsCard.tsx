/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { useObservable } from '@instana/hooks';
import { Message } from '@instana/components';

import {
  getScoredActionsForEventOrAlert,
  EventSpecification,
  getAllActionsWithAISuggestions,
  getAllActions,
  updateBuiltinEventActionAssociations,
  updateCustomEventActionAssociations
} from 'in-automation/api';
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
  let actionError = null;
  let selectedActions = [] as string[];
  if ('message' in actions) {
    actionError = actions.message;
  } else {
    selectedActions = (actions ?? []).map(action => action.id);
  }

  if (actionError) {
    return (
      <Message type="error" small withIcon>
        {actionError}
      </Message>
    );
  }
  return (
    <ActionTable
      title={title ?? t('in-automation:associatedActions')}
      showExecuteColumn={role?.canRunAutomationActions}
      showActionLink
      getEntityName={action => t('in-automation:actionAssociationWithNameForDelete', { actionName: action.name })}
      event={event}
      pageSize={7}
      tableActions={{
        delete: {
          deleteEntity: action => {
            deleteActionAssociationTracker({ actionName: action.name, actionType: action.type });
            const updatedActions = (actions as Action[]).filter(a => a.id !== action.id).map(({ id }) => id);
            const updateActionAssociations = isCustomEvent
              ? updateCustomEventActionAssociations
              : updateBuiltinEventActionAssociations;
            return updateActionAssociations(updatedActions, eventSpecificationId).tap(triggerReload);
          }
        }
      }}
      rightHeader={
        <RightHeader
          actions={Array.isArray(actions) ? actions : []}
          eventSpecification={eventSpecification}
          triggerReload={triggerReload}
          isCustomEvent={isCustomEvent}
        />
      }
      volatileId={volatileId}
      loadEntities={() => getScoredActionsForEventOrAlert(selectedActions, eventSpecification)}
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
    const updatedActions = [...associatedActionIds, ...selectedIds];
    const actionNames = allActions.reduce<string[]>(
      (acc, action) => [...acc, ...(updatedActions.includes(action.id) ? [action.name] : [])],
      []
    );

    associateActionsTracker({
      eventName: eventSpecification.name,
      actionNames,
      type: isCustomEvent ? 'Custom event' : 'Builtin event'
    });

    const updateActionAssociations = isCustomEvent
      ? updateCustomEventActionAssociations
      : updateBuiltinEventActionAssociations;
    return updateActionAssociations(updatedActions, eventSpecification.id).once(triggerReload);
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
