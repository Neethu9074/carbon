/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useMemo } from 'react';

import { useObservable } from '@instana/hooks';

import RecommendationActionForPoliciesTable from 'in-automation/AssociatedActions/RecommendationActionsForPoliciesTable';
import { getEventSpecificationId, getIsCustomEvent, useEventSpecificationData } from './sharedPolicies';
import { getAllActionsWithAISuggestions } from 'in-automation/api';
import { LoadingIndicator } from 'in-components/LoadingIndicators';
import { getPoliciesForTrigger } from 'in-automation/api';
import { pendingResult } from 'in-services/fixedObjects';
import { isLoading } from 'in-services/util/result';
import { Event, Policy, Result } from 'in-types';

interface SuggestedActionsCardProps {
  event: Event;
  reload: number;
  setReload: (r: number) => void;
  setSelectedType: (str: string) => void;
}

export default function RecommendedActionsForPoliciesCard({
  event,
  reload,
  setReload,
  setSelectedType
}: SuggestedActionsCardProps) {
  const eventSpecificationId = getEventSpecificationId(event);
  const isCustomEvent = getIsCustomEvent(event);
  const entityId = event?.entityId ?? '';
  const policies =
    useObservable(
      () => getPoliciesForTrigger(eventSpecificationId, isCustomEvent ? 'customEvent' : 'builtinEvent'),
      [eventSpecificationId, isCustomEvent, reload]
    ) ?? (pendingResult as Result<Policy[]>);

  const selectedActionsSet = useMemo(() => {
    const filteredPolicies = isLoading(policies)
      ? policies
      : {
          ...policies,
          data: policies?.data
        };

    const actionsSet: string[] = [];

    filteredPolicies?.data?.forEach(policy => {
      policy.typeConfigurations.forEach(typeConfiguration => {
        if (
          typeConfiguration.runnable &&
          typeConfiguration.runnable.runConfiguration &&
          typeConfiguration.runnable.runConfiguration.actions
        ) {
          typeConfiguration.runnable.runConfiguration.actions.forEach(runnable => {
            if (runnable?.action.id) {
              actionsSet.push(runnable.action.id);
            }
          });
        }
      });
    });

    return actionsSet;
  }, [policies]);

  const { eventSpecification } = useEventSpecificationData(eventSpecificationId, isCustomEvent, reload);

  const triggerReload = () => setReload(Math.random());

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

  if (!eventSpecification || !unusedSuggestedActions || !selectedActionsSet) {
    return <LoadingIndicator size="xl" />;
  }

  return (
    <>
      <RecommendationActionForPoliciesTable
        unusedSuggestedActions={unusedSuggestedActions}
        eventSpecification={eventSpecification}
        triggerReload={triggerReload}
        isCustomEvent={isCustomEvent}
        setSelectedType={setSelectedType}
      />
    </>
  );
}
