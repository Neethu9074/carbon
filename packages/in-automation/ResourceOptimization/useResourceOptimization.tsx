/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { useObservable } from '@instana/hooks';

import { Result, RecommendedAction, ResourceOptimization, ResourceImpactRsp, VolatileId, Event } from 'in-types';
import { ServerTableUrlState } from 'in-components/tables/ServerTable/hooks/useServerTableUrlState';
import getAgentSnapshotsInTimeframe, { OUT } from 'in-subscription/getAgentSnapshotsInTimeframe';
import { getResourceOptimization, getTurboActionResourceImpacts } from 'in-automation/api';
import { error, hasError, isLoading, success } from 'in-services/util/result';
import usePaginatedResult from 'in-automation/hooks/usePaginatedResult';
import { pendingResult } from 'in-services/fixedObjects';
import useTimeConfig from 'in-hooks/useTimeConfig';

interface UseResourceOptimizationsParams {
  event?: Event;
  applicationId?: string;
}

export function useResourceOptimization({ event, applicationId }: UseResourceOptimizationsParams) {
  const targetSnapshotId = event ? event.entityId : applicationId;
  const entityType = 'APPLICATION';
  const result = useObservable(getResourceOptimization(targetSnapshotId ?? '', entityType), []);
  return result ?? (pendingResult as Result<ResourceOptimization>);
}

export function useTurboRecommendedActions(resourceOptimization: Result<ResourceOptimization>) {
  if (isLoading(resourceOptimization)) return pendingResult as Result<RecommendedAction[]>;
  if (hasError(resourceOptimization))
    return error<RecommendedAction[]>([{ message: 'Failed to get turbo recommended actions.', code: 'SERVER' }]);
  const result = success(resourceOptimization?.data?.recommendedActions!);

  return result;
}

interface UsePaginatedRecommendedOptimizationsParams {
  setServerTableUrlState: (
    serverTableUrlState: Partial<Omit<ServerTableUrlState, 'disabledColumns' | 'enabledColumns'>>
  ) => void;
  serverTableUrlState: Omit<ServerTableUrlState, 'disabledColumns' | 'enabledColumns'>;
  recommendedActions: Result<RecommendedAction[]>;
}

export function usePaginatedResourceOptimizations({
  recommendedActions,
  serverTableUrlState,
  setServerTableUrlState
}: UsePaginatedRecommendedOptimizationsParams) {
  return usePaginatedResult({
    result: recommendedActions,
    serverTableUrlState,
    setServerTableUrlState,
    searchAttributes: ['name', 'impactedServices', 'actionCategory'],
    sort: entity => {
      const { orderBy } = serverTableUrlState;
      let value = entity[orderBy as keyof RecommendedAction];
      return typeof value === 'string' ? value.trim().toLowerCase() : value;
    }
  });
}

export function useTurboAgentSnapShots() {
  const timeConfig = useTimeConfig();
  const query = 'entity.agent.capability:turbonomic-action';
  const agentSnapShots: OUT | null | undefined = useObservable(
    () => getAgentSnapshotsInTimeframe({ timeConfig, query }),
    [timeConfig]
  );

  return agentSnapShots;
}

interface useResourceImpactsProps {
  volatileId: VolatileId;
  actionInstanceId: string;
  createdDate: number;
}

export function useResourceImpacts({ volatileId, actionInstanceId, createdDate }: useResourceImpactsProps) {
  const result =
    useObservable(
      getTurboActionResourceImpacts({
        volatileId,
        actionInstanceId,
        createdDate
      }),
      [volatileId]
    ) ?? (pendingResult as Result<ResourceImpactRsp>);

  if (isLoading(result)) return pendingResult as Result<ResourceImpactRsp>;
  if (hasError(result))
    return error<ResourceImpactRsp>([{ message: 'Failed to get resource impact.', code: 'SERVER' }]);
  return success(result as Result<ResourceImpactRsp>);
}
