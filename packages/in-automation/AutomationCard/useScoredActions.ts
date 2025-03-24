/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { create, timeout } from '@instana/observables';
import { Event, Policy, Result } from '@instana/types';
import { useObservable } from '@instana/hooks';

import { ServerTableUrlState } from 'in-components/tables/ServerTable/hooks/useServerTableUrlState';
import { error, hasError, isLoading, success } from 'in-services/util/result';
import { getTriggerTypeFromEvent } from 'in-automation/AutomationCard/shared';
import { ScoredAction, TriggerSpecification } from 'in-automation/types';
import usePaginatedResult from 'in-automation/hooks/usePaginatedResult';
import { getAllActionsWithAISuggestions } from 'in-automation/api';
import { pendingResult } from 'in-services/fixedObjects';

interface UseScoredActionsParams {
  event: Event;
  trigger: Result<TriggerSpecification>;
  type: 'default' | 'watsonx';
  selectedDescription?: string | null;
  selectedEntityType?: string | null;
}

const refreshSignal = create().emit(true);
export function refresh() {
  timeout(1000).once(() => refreshSignal.emit(true));
}

export default function useScoredActions({
  event,
  trigger,
  type,
  selectedEntityType,
  selectedDescription
}: UseScoredActionsParams) {
  const triggerType = getTriggerTypeFromEvent(event);

  return (
    useObservable(() => {
      if (isLoading(trigger)) {
        return null;
      }
      if (type === 'watsonx' && triggerType !== 'builtinEvent') {
        return null; // we are not supporting OOTB watsonx actions for any other events except builtin events. this code avoids making api call in that case
      }
      return refreshSignal.flatMap(() => {
        if (hasError(trigger)) {
          return getAllActionsWithAISuggestions(event.problem?.problemText ?? '', '');
        } else {
          const { name, description = '', id: eventId } = trigger.data!;
          const { entityId } = event;
          const updatedDescription =
            selectedDescription !== undefined && selectedDescription !== null
              ? `Higher than expected error rate going through ${selectedDescription} in ${selectedEntityType ?? ''}`
              : description ?? '';
          const updatedEntityType =
            selectedEntityType !== undefined && selectedEntityType !== null ? selectedEntityType : entityId ?? '';
          return getAllActionsWithAISuggestions(name, updatedDescription, updatedEntityType, type, eventId);
        }
      });
    }, [trigger.progress.loading, refreshSignal, selectedDescription, selectedEntityType]) ??
    (pendingResult as Result<ScoredAction[]>)
  );
}

interface UseRecommendedScoredActionsParams {
  actions: Result<ScoredAction[]>;
  policies: Result<Policy[]>;
}

export function useUserRecommendedScoredActions({ actions, policies }: UseRecommendedScoredActionsParams) {
  if (isLoading(actions, policies)) return pendingResult as Result<ScoredAction[]>;
  if (hasError(actions, policies))
    return error<ScoredAction[]>([{ message: 'Failed to filter recommended actions.', code: 'SERVER' }]);
  return success(
    actions.data!.filter(action => {
      const policyExistWithAction = policies.data!.some(
        policy => policy.typeConfigurations[0]?.runnable.runConfiguration.actions[0].action.id === action.id
      );
      return !policyExistWithAction && action.confidence != 'low' && !action.metadata?.builtIn;
    })
  );
}

export function useAIRecommendedScoredActions({ actions, policies }: UseRecommendedScoredActionsParams) {
  if (isLoading(actions, policies)) return pendingResult as Result<ScoredAction[]>;
  if (hasError(actions, policies))
    return error<ScoredAction[]>([{ message: 'Failed to filter recommended actions.', code: 'SERVER' }]);

  return success(actions.data!);
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
    searchAttributes: ['name', 'description', 'type', action => action?.tags?.toString() ?? ''],
    sort: entity => {
      const { orderBy } = serverTableUrlState;
      let value = entity[orderBy as keyof ScoredAction];
      if (orderBy === 'score') {
        return [entity.score, entity.name.trim().toLowerCase()];
      }
      return typeof value === 'string' ? value.trim().toLowerCase() : value;
    }
  });
}
