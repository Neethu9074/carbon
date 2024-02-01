/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { useMemo, useState } from 'react';

import { useObservable } from '@instana/hooks';
import { Message } from '@instana/components';

import RecommendationActionsTable from 'in-automation/AssociatedActions/RecommendationActionsTable';
import { getEventSpecificationId, getIsCustomEvent, useAssociatedActionsData } from './shared';
import NotificationComponent from 'in-components/form/Notification/Notification';
import { getAllActionsWithAISuggestions } from 'in-automation/api';
import { LoadingIndicator } from 'in-components/LoadingIndicators';
import { Event } from 'in-types';
import { t } from 'in-i18n';

interface SuggestedActionsCardProps {
  event: Event;
  reload: number;
  setReload: (r: number) => void;
  setSelectedType: (str: string) => void;
}

export default function RecommendedActionsCard({
  event,
  reload,
  setReload,
  setSelectedType
}: SuggestedActionsCardProps) {
  const [error, setError] = useState(false);
  const eventSpecificationId = getEventSpecificationId(event);
  const isCustomEvent = getIsCustomEvent(event);
  const entityId = event?.entityId ?? '';
  const { actions: existingActions, eventSpecification } = useAssociatedActionsData(
    eventSpecificationId,
    isCustomEvent,
    reload
  );

  const triggerReload = () => setReload(Math.random());
  let actionError = null;

  // Memoize the creation of selectedActionsSet
  const selectedActionsSet = useMemo(() => {
    if (existingActions && Array.isArray(existingActions)) {
      return (existingActions ?? []).map(action => action.id);
    }
    return [];
  }, [existingActions]);

  if (existingActions && 'message' in existingActions) {
    actionError = existingActions.message;
  }

  function getUnusedSuggestedActions() {
    return getAllActionsWithAISuggestions(
      eventSpecification?.name ?? '',
      eventSpecification?.description ?? '',
      entityId
    ).map(allActions => {
      return allActions
        .filter(action => action.confidence != 'low' && !selectedActionsSet.includes(action.id))
        .sort((a, b) => b.score - a.score);
    });
  }

  const unusedSuggestedActions = useObservable(getUnusedSuggestedActions, [
    eventSpecification,
    selectedActionsSet,
    reload
  ]);

  if (!eventSpecification || !unusedSuggestedActions || !existingActions) {
    return <LoadingIndicator size="xl" />;
  }

  return (
    <>
      {error && <NotificationComponent failure>{t('in-automation:failedToSaveAssocation')}</NotificationComponent>}
      {actionError && (
        <Message type="error" small withIcon>
          {actionError}
        </Message>
      )}
      {actionError === null && Array.isArray(existingActions) && (
        <RecommendationActionsTable
          unusedSuggestedActions={unusedSuggestedActions}
          existingActions={existingActions}
          eventSpecification={eventSpecification}
          triggerReload={triggerReload}
          setError={setError}
          isCustomEvent={isCustomEvent}
          setSelectedType={setSelectedType}
          isApplicationSmartAlert={false}
        />
      )}
    </>
  );
}
