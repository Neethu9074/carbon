/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { useObservable } from '@instana/hooks';
import { create } from '@instana/observables';

import { ServerTableUrlState } from 'in-components/tables/ServerTable/hooks/useServerTableUrlState';
import { resultToFetchedStateResponse } from 'in-hooks/utils/resultToFetchedStateResponse';
import { AUTOMATIC, MANUAL, isAutomatic, isManual } from 'in-automation/Policies/types';
import usePaginatedResult from 'in-automation/hooks/usePaginatedResult';
import { Policy, Result, TypeConfigurationType } from 'in-types';
import { pendingResult } from 'in-services/fixedObjects';
import { mapData } from 'in-services/util/result';
import { getPolicies } from 'in-automation/api';

export interface UsePoliciesParams {
  serverTableUrlState: Omit<ServerTableUrlState, 'disabledColumns' | 'enabledColumns'>;
  setServerTableUrlState: (
    serverTableUrlState: Partial<Omit<ServerTableUrlState, 'disabledColumns' | 'enabledColumns'>>
  ) => void;
  tags: string[];
  type?: TypeConfigurationType;
}

const refreshSignal = create().emit(true);
export function refresh() {
  refreshSignal.emit(true);
}

export default function usePolicies({ serverTableUrlState, setServerTableUrlState, tags, type }: UsePoliciesParams) {
  const policies = useObservable(refreshSignal.flatMap(getPolicies), []) ?? (pendingResult as Result<Policy[]>);

  const filters = [
    {
      key: 'type' as const,
      value: type
    },
    {
      key: 'tags' as const,
      value: tags
    }
  ];
  const filteredPolicies = mapData(policies, data =>
    data?.filter(policy =>
      filters.reduce((shouldInclude, filter) => {
        const emptyFilter = !filter.value?.length;
        if (emptyFilter) return shouldInclude;
        switch (filter.key) {
          case 'type': {
            const policyMatchManualFilter = filter.value === MANUAL && isManual(policy);
            const policyMatchAutomaticFilter = filter.value === AUTOMATIC && isAutomatic(policy);
            return shouldInclude && shouldInclude && (policyMatchManualFilter || policyMatchAutomaticFilter);
          }
          case 'tags':
            return shouldInclude && (policy.tags?.some(tag => filter.value.includes(tag)) ?? false);
        }
      }, true)
    )
  );

  const availableTags = [...new Set(policies?.data?.flatMap(({ tags }) => tags ?? []))];
  const result = usePaginatedResult({
    result: filteredPolicies,
    serverTableUrlState,
    setServerTableUrlState,
    searchAttributes: [
      'name',
      'description',
      policy => policy?.tags?.toString() ?? '',
      policy => policy?.trigger?.name ?? '',
      policy => policy.typeConfigurations[0]?.runnable.runConfiguration.actions[0].action.name
    ],
    sort: entity => {
      const { orderBy } = serverTableUrlState;
      const value = entity[orderBy as keyof Policy];
      if (orderBy === 'trigger') {
        return entity.trigger.name?.trim()?.toLowerCase();
      }
      if (orderBy === 'actionName') {
        return entity.typeConfigurations[0]?.runnable.runConfiguration.actions[0].action.name?.trim()?.toLowerCase();
      }
      return typeof value === 'string' ? value.trim().toLowerCase() : value;
    }
  });
  return [resultToFetchedStateResponse(result), availableTags] as const;
}
