/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { Button, Spacer } from '@instana/components';

import createMemoizedObservableForReferencedEntities from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Alerts/components/memoizeReferencedEntitiesObservable';
import ConfigureAssociatedActionsDialog from 'in-automation/ConfigureAssociatedActionsDialog/ConfigureAssociatedActionsDialog';
import { getEventSpecificationId, getIsCustomEvent, useAssociatedActionsData, useDualReload } from './shared';
import { getScoredActionsForEventOrAlert, EventSpecification } from 'in-automation/api';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import { LoadingIndicator } from 'in-components/LoadingIndicators';
import ActionTable from 'in-automation/ActionCatalog/ActionTable';
import { Event, VolatileId, Action } from 'in-types';
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

  const selectedActions = (actions ?? []).map(action => action.id);

  if (!eventSpecification) {
    return <LoadingIndicator size="xl" />;
  }

  const getScoredActionsForEventMemoized = createMemoizedObservableForReferencedEntities(selectedActions =>
    getScoredActionsForEventOrAlert(selectedActions, eventSpecification)
  );

  return (
    <ActionTable
      title={title ?? t('in-automation:associatedActions')}
      showExecuteColumn={role?.canRunAutomationActions}
      showActionLink
      event={event}
      rightHeader={
        <RightHeader
          eventSpecification={eventSpecification}
          triggerReload={triggerReload}
          actions={actions ?? []}
          isCustomEvent={isCustomEvent}
        />
      }
      volatileId={volatileId}
      loadEntities={() => getScoredActionsForEventMemoized(selectedActions)}
      scored
      isBeta
    />
  );
}

interface RightHeaderProps {
  eventSpecification: EventSpecification;
  actions: Action[];
  isCustomEvent: boolean;
  triggerReload: () => void;
}

function RightHeader({ eventSpecification, actions, isCustomEvent, triggerReload }: RightHeaderProps) {
  const onClick = () =>
    addActiveDialog(
      <ConfigureAssociatedActionsDialog
        eventSpecification={eventSpecification}
        actions={actions}
        isCustomEvent={isCustomEvent}
        onClose={close}
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
