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
  getCustomEventSpecificationMutable
} from 'in-api/eventSpecifications';
import createMemoizedObservableForReferencedEntities from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Alerts/components/memoizeReferencedEntitiesObservable';
import { getScoredActionsForEventOrAlert, EventSpecification } from 'in-automation/api';
import AssociatedActionsRightHeader from './AssociatedActionsRightHeader';
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

function getObservables(isCustomEvent: boolean) {
  return {
    getEventSpecification: isCustomEvent ? getCustomEventSpecificationMutable : getBuiltInEventSpecificationMutable,
    getActionsForEventSpecification: isCustomEvent ? getCustomEventActions : getBuiltinEventActions
  };
}

function useAssociatedActionsData(eventSpecificationId: string, isCustomEvent: boolean, reload: number) {
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
  return { actions, eventSpecification };
}

const getIsCustomEvent = (event: AssociatedActionsCardProps['event']) =>
  (event?.metadata?.custom_issue as boolean) ?? false;
const getEventSpecificationId = (event: AssociatedActionsCardProps['event']) =>
  event?.metadata?.eventSpecificationId as string;

export default function AssociatedActionsCard({
  event,
  volatileId,
  title,
  reload: outerReload,
  setReload: setOuterReload
}: AssociatedActionsCardProps) {
  const eventSpecificationId = getEventSpecificationId(event);
  const isCustomEvent = getIsCustomEvent(event);

  const [innerReload, setInnerReload] = useState(0);
  const reload = innerReload + (outerReload ?? 0);
  const triggerReload = () => {
    setInnerReload(Math.random());
    if (setOuterReload) {
      setOuterReload(Math.random());
    }
  };

  const { actions, eventSpecification } = useAssociatedActionsData(eventSpecificationId, isCustomEvent, reload);

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
        <AssociatedActionsRightHeader
          eventSpecification={eventSpecification}
          triggerReload={triggerReload}
          actions={actions}
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
