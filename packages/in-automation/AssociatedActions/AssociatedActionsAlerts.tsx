/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useState } from 'react';

import { Button, Spacer } from '@instana/components';
import { useObservable } from '@instana/hooks';

import createMemoizedObservableForReferencedEntities from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Alerts/components/memoizeReferencedEntitiesObservable';
import ConfigureAssociatedActionsAlertsDialog from 'in-automation/AssociatedActions/ConfigureAssociatedActionsAlertsDialog';
import { Event, VolatileId, Action, ApplicationAlertConfigWithMetadata } from 'in-types';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import { getApplicationAlertActionAssociations } from 'in-automation/api';
import { getScoredActionsForEventOrAlert } from 'in-automation/api';
import { LoadingIndicator } from 'in-components/LoadingIndicators';
import ActionTable from 'in-automation/ActionCatalog/ActionTable';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

interface AssociatedActionsCardProps {
  event: Event;
  volatileId: VolatileId;
  alertConfig?: ApplicationAlertConfigWithMetadata;
  reload?: number;
  setReload?: (r: number) => void;
}

const getEventSpecificationId = (event: AssociatedActionsCardProps['event']) =>
  event?.metadata?.eventSpecificationId as string;

export default function AssociatedActionsAlerts({
  event,
  volatileId,
  alertConfig,
  reload: externalReload,
  setReload: setExternalReload
}: AssociatedActionsCardProps) {
  const eventSpecificationId = getEventSpecificationId(event);

  // internalReload exists to track the reload status within this component, which is necessrary
  // if the extrernalReload prop isn't passed in. The component's data will be re-fetched
  // whenever either of the reload states are modified.
  const [internalReload, setInternalReload] = useState(0);
  const reload = internalReload + (externalReload ?? 0);
  const triggerReload = () => {
    setInternalReload(Math.random());
    if (setExternalReload) {
      setExternalReload(Math.random());
    }
  };

  const actions =
    useObservable(() => getApplicationAlertActionAssociations(eventSpecificationId), [eventSpecificationId, reload]) ??
    [];
  const selectedActions = actions.map((action: Action) => action.id);

  if (!alertConfig) {
    return <LoadingIndicator size="xl" />;
  }

  const getScoredActionsForAlertMemoized = createMemoizedObservableForReferencedEntities(selectedActions =>
    getScoredActionsForEventOrAlert(selectedActions, alertConfig)
  );

  return (
    <ActionTable
      title={t('in-automation:associatedActions')}
      showExecuteColumn={role?.canRunAutomationActions}
      showActionLink
      event={event}
      rightHeader={
        <RightHeader eventSpecification={alertConfig} actions={actions} reload={reload} triggerReload={triggerReload} />
      }
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
  reload: number;
}

function RightHeader({ eventSpecification, actions, reload, triggerReload }: RightHeaderProps) {
  const onClick = () =>
    addActiveDialog(
      <ConfigureAssociatedActionsAlertsDialog
        eventSpecification={eventSpecification}
        actions={actions}
        onClose={close}
        reload={reload}
        triggerReload={triggerReload}
      />
    );

  return (
    <>
      <Button kind="action" icon="lib_openclose_add_circle_outline" onClick={onClick}>
        {t('in-automation:selectActions')}
      </Button>
      <Spacer horizontal="xsmall" />
    </>
  );
}
