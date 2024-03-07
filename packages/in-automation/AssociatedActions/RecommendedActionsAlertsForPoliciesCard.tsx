/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useMemo } from 'react';

import { useObservable } from '@instana/hooks';

import RecommendationActionForPoliciesTable from 'in-automation/AssociatedActions/RecommendationActionsForPoliciesTable';
import { Event, ApplicationAlertConfigWithMetadata, Policy, Result, VolatileId } from 'in-types';
import { getAllActionsWithAISuggestions, getPoliciesForTrigger } from 'in-automation/api';
import { getEventSpecificationId, getIsCustomEvent } from './shared';
import { LoadingIndicator } from 'in-components/LoadingIndicators';
import { pendingResult } from 'in-services/fixedObjects';
import { isLoading } from 'in-services/util/result';

interface RecommendedActionsAlertsForPoliciesCardProps {
  event: Event;
  reload: number;
  setReload: (r: number) => void;
  alertConfig?: ApplicationAlertConfigWithMetadata | null;
  setSelectedType: (str: string) => void;
  volatileId: VolatileId;
}

export default function RecommendedActionsAlertsForPoliciesCard({
  event,
  reload,
  setReload,
  alertConfig,
  setSelectedType,
  volatileId
}: RecommendedActionsAlertsForPoliciesCardProps) {
  const eventSpecificationId = getEventSpecificationId(event);
  const isCustomEvent = getIsCustomEvent(event);
  const entityId = event?.entityId ?? '';
  const policies =
    useObservable(
      () => getPoliciesForTrigger(eventSpecificationId, 'applicationSmartAlert'),
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

  const triggerReload = () => setReload(Math.random());

  function getUnusedSuggestedActions() {
    return getAllActionsWithAISuggestions(alertConfig?.name ?? '', alertConfig?.description ?? '', entityId).map(
      allActions => {
        return allActions
          .filter(action => action.confidence != 'low' && !selectedActionsSet.includes(action.id))
          .sort((a, b) => b.score - a.score);
      }
    );
  }
  const unusedSuggestedActions = useObservable(getUnusedSuggestedActions, [alertConfig, selectedActionsSet, reload]);

  if (!alertConfig || !unusedSuggestedActions || !selectedActionsSet) {
    return <LoadingIndicator size="xl" />;
  }

  return (
    <>
      <RecommendationActionForPoliciesTable
        unusedSuggestedActions={unusedSuggestedActions}
        eventSpecification={alertConfig}
        triggerReload={triggerReload}
        isApplicationSmartAlert
        isCustomEvent={false}
        volatileId={volatileId}
        setSelectedType={setSelectedType}
        event={event}
      />
    </>
  );
}
