/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { Button, Spacer } from '@instana/components';
import { useObservable } from '@instana/hooks';

import {
  getCustomEventActions,
  getBuiltinEventActions,
  getBuiltInEventSpecificationMutable,
  getCustomEventSpecificationMutable
} from 'in-api/eventSpecifications';
import createMemoizedObservableForReferencedEntities from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Alerts/components/memoizeReferencedEntitiesObservable';
import ConfigureAssociatedActionsDialog from 'in-automation/ConfigureAssociatedActionsDialog/ConfigureAssociatedActionsDialog';
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
}

function getObservables(isCustomEvent: boolean) {
  return {
    getEventSpecification: isCustomEvent ? getCustomEventSpecificationMutable : getBuiltInEventSpecificationMutable,
    getActionsForEventSpecification: isCustomEvent ? getCustomEventActions : getBuiltinEventActions
  };
}

function useAssociatedActionsData(eventSpecificationId: string, isCustomEvent: boolean) {
  const { getEventSpecification, getActionsForEventSpecification } = getObservables(isCustomEvent);
  const actions =
    useObservable<Action[], [string]>(
      () => getActionsForEventSpecification(eventSpecificationId),
      [eventSpecificationId]
    ) ?? [];

  const eventSpecification = useObservable<EventSpecification, [string]>(
    () => getEventSpecification(eventSpecificationId),
    [eventSpecificationId]
  );
  return { actions, eventSpecification };
}

const getIsCustomEvent = (event: AssociatedActionsCardProps['event']) =>
  (event?.metadata?.custom_issue as boolean) ?? false;
const getEventSpecificationId = (event: AssociatedActionsCardProps['event']) =>
  event?.metadata?.eventSpecificationId as string;

export default function AssociatedActionsCard({ event, volatileId, title }: AssociatedActionsCardProps) {
  const eventSpecificationId = getEventSpecificationId(event);
  const isCustomEvent = getIsCustomEvent(event);
  const { actions, eventSpecification } = useAssociatedActionsData(eventSpecificationId, isCustomEvent);
  const selectedActions = actions.map(action => action.id);

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
        <RightHeader eventSpecification={eventSpecification} actions={actions} isCustomEvent={isCustomEvent} />
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
}

function RightHeader({ eventSpecification, actions, isCustomEvent }: RightHeaderProps) {
  const onClick = () =>
    addActiveDialog(
      <ConfigureAssociatedActionsDialog
        eventSpecification={eventSpecification}
        actions={actions}
        isCustomEvent={isCustomEvent}
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
