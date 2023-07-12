/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { useMemo } from 'react';

import { useObservable } from '@instana/hooks';

import {
  getCustomEventActions,
  getBuiltinEventActions,
  getBuiltInEventSpecificationMutable,
  getCustomEventSpecificationMutable
} from 'in-api/eventSpecifications';
import { EventSpecification, getAllActionsWithAISuggestions } from 'in-automation/api';
import { LoadingIndicator } from 'in-components/LoadingIndicators';
import ActionTable from 'in-automation/ActionCatalog/ActionTable';
import { Event, VolatileId, Action } from 'in-types';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

interface SuggestedActionsCardProps {
  event: Event;
  volatileId: VolatileId;
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

const getIsCustomEvent = (event: SuggestedActionsCardProps['event']) =>
  (event?.metadata?.custom_issue as boolean) ?? false;
const getEventSpecificationId = (event: SuggestedActionsCardProps['event']) =>
  event?.metadata?.eventSpecificationId as string;

export default function SuggestedActionsCard({ event, volatileId }: SuggestedActionsCardProps) {
  const eventSpecificationId = getEventSpecificationId(event);
  const isCustomEvent = getIsCustomEvent(event);
  const { actions, eventSpecification } = useAssociatedActionsData(eventSpecificationId, isCustomEvent);
  const selectedActions = actions.map(action => action.id);

  const getUnusedSuggestedActions = useMemo(() => {
    if (!eventSpecification) return null;
    const selectedActionsSet = new Set(selectedActions);
    return getAllActionsWithAISuggestions(eventSpecification.name, eventSpecification.description ?? '').map(actions =>
      actions.filter(action => !selectedActionsSet.has(action.id))
    );
    // const scoredActions = new Set(getScoredActionsForEventMemoized(selectedActions).map(actions => actions.map(action => action.id)));
  }, [eventSpecification, selectedActions]);

  if (!getUnusedSuggestedActions) {
    return <LoadingIndicator size="xl" />;
  }

  return (
    <ActionTable
      title={t('in-events:recommendedActions')}
      showExecuteColumn={role?.canRunAutomationActions}
      showActionLink
      event={event}
      volatileId={volatileId}
      pageSize={5}
      loadEntities={() => getUnusedSuggestedActions}
      scored
      isBeta
    />
  );
}
