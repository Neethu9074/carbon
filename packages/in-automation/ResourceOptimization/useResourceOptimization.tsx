/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import {
  Result,
  RecommendedAction,
  ResourceOptimization,
  ResourceImpactRsp,
  VolatileId,
  Event,
  TimeConfig
} from '@instana/types';
import { EntityType, TargetEntityType } from '@instana/types';
import { create, timeout } from '@instana/observables';
import { useObservable } from '@instana/hooks';

import { GetActionInstanceListData } from 'in-automation/components/ActionHistory/ActionHistoryTable';
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
  actionCategory?: string;
}

function convertEntityTypesToTarget(et: EntityType | undefined): TargetEntityType | null {
  const mapping: { [key: string]: string } = {
    Entity10: 'INFRASTRUCTURE',
    App20: 'APPLICATION',
    Service20: 'SERVICE',
    Endpoint20: 'ENDPOINT'
  };
  return et ? (mapping[et as string] as TargetEntityType) ?? null : null;
}

const refreshSignal = create().emit(true);
export function refresh() {
  timeout(1000).once(() => refreshSignal.emit(true));
}

export function useResourceOptimization({ event, applicationId, actionCategory }: UseResourceOptimizationsParams) {
  const targetSnapshotId = event ? event.entityId : applicationId;
  const entityType = event ? convertEntityTypesToTarget(event?.entityType) : 'APPLICATION';
  return (
    useObservable(() => {
      return refreshSignal.flatMap(() => {
        return getResourceOptimization(targetSnapshotId ?? '', entityType, actionCategory);
      });
    }, [refreshSignal]) ?? (pendingResult as Result<ResourceOptimization>)
  );
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
    searchAttributes: ['name', 'actionCategory'],
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

interface GetActionInstanceListDataParams {
  timeConfig: TimeConfig;
  eventId?: string;
  types?: string[];
}

function GetActionInstanceListDataFunc({ timeConfig, eventId, types }: GetActionInstanceListDataParams) {
  return GetActionInstanceListData({
    timeConfig,
    eventId,
    types: types ?? [],
    actionStatuses: []
  }).startWith(pendingResult);
}

export function useResourceActionHistoryCount({ eventId, types }: { eventId?: string; types?: string[] }) {
  const timeConfig = useTimeConfig();
  const result =
    useObservable(
      () => refreshSignal.flatMap(() => GetActionInstanceListDataFunc({ timeConfig, eventId, types })),
      []
    ) ?? pendingResult;
  return result?.data?.totalHits;
}
