/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Button, Spacer } from '@instana/components';
import { useObservable } from '@instana/hooks';

import createMemoizedObservableForReferencedEntities from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Alerts/components/memoizeReferencedEntitiesObservable';
import ConfigureAssociatedActionsAlertsDialog from 'in-automation/AssociatedActionsCard/ConfigureAssociatedActionsAlertsDialog';
import { Event, VolatileId, Action, ApplicationAlertConfigWithMetadata } from 'in-types';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import { getNewAssociationApplicationAlert } from 'in-automation/api';
import { LoadingIndicator } from 'in-components/LoadingIndicators';
import ActionTable from 'in-automation/ActionCatalog/ActionTable';
import { getScoredActionsForEvent } from 'in-automation/api';
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

  const actions =
    useObservable(() => getNewAssociationApplicationAlert(eventSpecificationId), [eventSpecificationId]) ?? [];
  const selectedActions = actions.map((action: Action) => action.id);

  if (!alertConfig) {
    return <LoadingIndicator size="xl" />;
  }

  const getScoredActionsForAlertMemoized = createMemoizedObservableForReferencedEntities(selectedActions =>
    getScoredActionsForEvent(selectedActions, alertConfig)
  );

  return (
    <ActionTable
      title={t('in-automation:associatedActions')}
      showExecuteColumn={role?.canRunAutomationActions}
      showActionLink
      event={event}
      rightHeader={<RightHeader eventSpecification={alertConfig} actions={actions} />}
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
}

function RightHeader({ eventSpecification, actions }: RightHeaderProps) {
  const onClick = () =>
    addActiveDialog(
      <ConfigureAssociatedActionsAlertsDialog
        eventSpecification={eventSpecification}
        actions={actions}
        onClose={close}
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
