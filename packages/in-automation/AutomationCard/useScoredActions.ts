/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { useObservable } from '@instana/hooks';

import { ServerTableUrlState } from 'in-components/tables/ServerTable/hooks/useServerTableUrlState';
import { ScoredAction, getAllActionsWithAISuggestions } from 'in-automation/api';
import { error, hasError, isLoading, success } from 'in-services/util/result';
import usePaginatedResult from 'in-automation/hooks/usePaginatedResult';
import { TriggerSpecification } from 'in-automation/Policies/types';
import { pendingResult } from 'in-services/fixedObjects';
import { Event, Policy, Result } from 'in-types';

interface UseScoredActionsParams {
  event: Event;
  trigger: Result<TriggerSpecification>;
}

export default function useScoredActions({ event, trigger }: UseScoredActionsParams) {
  return (
    useObservable(() => {
      if (isLoading(trigger)) return null;
      if (hasError(trigger)) {
        return getAllActionsWithAISuggestions(event.problem?.problemText ?? '', '');
      } else {
        const { name, description = '' } = trigger.data!;
        const { entityId } = event;
        return getAllActionsWithAISuggestions(name, description, entityId);
      }
    }, [trigger.progress.loading]) ?? (pendingResult as Result<ScoredAction[]>)
  );
}

interface UseRecommendedScoredActionsParams {
  actions: Result<ScoredAction[]>;
  policies: Result<Policy[]>;
}

export function useRecommendedScoredActions({ actions, policies }: UseRecommendedScoredActionsParams) {
  if (isLoading(actions, policies)) return pendingResult as Result<ScoredAction[]>;
  if (hasError(actions, policies))
    return error<ScoredAction[]>([{ message: 'Failed to filter recommended actions.', code: 'SERVER' }]);
  return success(
    actions
      .data!.filter(action => {
        const policyExistWithAction = policies.data!.some(
          policy => policy.typeConfigurations[0]?.runnable.runConfiguration.actions[0].action.id === action.id
        );
        return !policyExistWithAction && action.confidence != 'low';
      })
      .sort((a, b) => b.score - a.score)
  );
}

interface UsePaginatedScoredActionsParams {
  setServerTableUrlState: (
    serverTableUrlState: Partial<Omit<ServerTableUrlState, 'disabledColumns' | 'enabledColumns'>>
  ) => void;
  serverTableUrlState: Omit<ServerTableUrlState, 'disabledColumns' | 'enabledColumns'>;
  actions: Result<ScoredAction[]>;
}

export function usePaginatedScoredActions({
  actions,
  serverTableUrlState,
  setServerTableUrlState
}: UsePaginatedScoredActionsParams) {
  return usePaginatedResult({
    result: actions,
    serverTableUrlState,
    setServerTableUrlState,
    searchAttributes: ['name', 'description', 'type', action => action?.tags?.toString() ?? '']
  });
}
