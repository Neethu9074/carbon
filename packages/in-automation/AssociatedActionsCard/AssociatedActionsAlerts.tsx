/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useState } from 'react';

import { useObservable } from '@instana/hooks';

import createMemoizedObservableForReferencedEntities from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Alerts/components/memoizeReferencedEntitiesObservable';
import {
  getApplicationAlertActionAssociations,
  getAllActions,
  updateApplicationAlertAssociations,
  getAllActionsWithAISuggestions
} from 'in-automation/api';
import SelectListDialogButton from 'in-settings/tabs/TeamSettings/components/SelectListDialogButton';
import { associateActionsTracker, trackAlertActionAssociated } from 'in-automation/tracker';
import { Event, VolatileId, Action, ApplicationAlertConfigWithMetadata } from 'in-types';
import ActionTable, { ActionTableProps } from 'in-automation/ActionCatalog/ActionTable';
import { getScoredActionsForEventOrAlert } from 'in-automation/api';
import { LoadingIndicator } from 'in-components/LoadingIndicators';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

interface AssociatedActionsCardProps {
  event: Event;
  volatileId: VolatileId;
  alertConfig?: ApplicationAlertConfigWithMetadata;
}

const getEventSpecificationId = (event: AssociatedActionsCardProps['event']) =>
  event?.metadata?.eventSpecificationId as string;

export default function AssociatedActionsAlerts({ event, volatileId, alertConfig }: AssociatedActionsCardProps) {
  const eventSpecificationId = getEventSpecificationId(event);
  const [reload, triggerReload] = useState<number>(0);

  const actions =
    useObservable(() => getApplicationAlertActionAssociations(eventSpecificationId), [eventSpecificationId, reload], {
      resetStateOnObservableChange: false
    }) ?? [];
  const selectedActions = actions.map((action: Action) => action.id);

  if (!alertConfig) {
    return <LoadingIndicator size="xl" />;
  }

  const getScoredActionsForAlertMemoized = createMemoizedObservableForReferencedEntities(selectedActions =>
    getScoredActionsForEventOrAlert(selectedActions, alertConfig)
  );
  const Reload = () => {
    // This helps to reload the actions table
    triggerReload(Math.random());
  };

  return (
    <ActionTable
      title={t('in-automation:associatedActions')}
      showExecuteColumn={role?.canRunAutomationActions}
      showActionLink
      event={event}
      getEntityName={action => t('in-automation:actionAssociationWithNameForDelete', { actionName: action.name })}
      tableActions={{
        delete: {
          deleteEntity: action => {
            const updatedActions = actions.filter(a => a.id !== action.id).map(obj => obj.id);
            return updateApplicationAlertAssociations({ actions: updatedActions, alertId: eventSpecificationId }).map(
              Reload
            );
          }
        }
      }}
      rightHeader={<RightHeader actions={actions} eventSpecification={alertConfig} triggerReload={triggerReload} />}
      volatileId={volatileId}
      loadEntities={() => getScoredActionsForAlertMemoized(selectedActions)}
      scored
      isBeta
    />
  );
}

interface RightHeaderProps {
  eventSpecification: ApplicationAlertConfigWithMetadata;
  actions: Action[];
  triggerReload: (n: number) => void;
}

function RightHeader({ eventSpecification, actions, triggerReload }: RightHeaderProps) {
  const allActions = useObservable<Action[], never[]>(getAllActions, []) ?? [];
  const associatedActionIds = actions.map(a => a.id);

  const { id: applicationId, name: eventName } = eventSpecification;
  function submitActionSelection(selectedIds: string[]) {
    const updatedActionIds = [...associatedActionIds, ...selectedIds];

    const actionNames = allActions.reduce<string[]>(
      (acc, action) => [...acc, ...(updatedActionIds.includes(action.id) ? [action.name] : [])],
      []
    );
    associateActionsTracker({
      eventName,
      actionNames
    });

    trackAlertActionAssociated(actionNames, applicationId);
    updateApplicationAlertAssociations({ actions: updatedActionIds, alertId: applicationId }).once(triggerReload);
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
