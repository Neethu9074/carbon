/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { ActionConfiguration, Policy, Result, TypeConfigurationType } from '@instana/types';
import { useObservable } from '@instana/hooks';
import { create } from '@instana/observables';

import { getActionConfigurationFromPolicy, isAutomatic, isManual } from 'in-automation/utils/policy';
import { ServerTableUrlState } from 'in-components/tables/ServerTable/hooks/useServerTableUrlState';
import usePaginatedResult from 'in-automation/hooks/usePaginatedResult';
import { pendingResult } from 'in-services/fixedObjects';
import { POLICY_TYPE } from 'in-automation/constants';
import { mapData } from 'in-services/util/result';
import { getPolicies } from 'in-automation/api';

const refreshSignal = create().emit(true);
export function refresh() {
  refreshSignal.emit(true);
}

export default function usePolicies() {
  return useObservable(refreshSignal.flatMap(getPolicies), []) ?? (pendingResult as Result<Policy[]>);
}

export interface UsePaginatedPoliciesParams {
  policies: Result<Policy[]>;
  serverTableUrlState: Omit<ServerTableUrlState, 'disabledColumns' | 'enabledColumns'>;
  setServerTableUrlState: (
    serverTableUrlState: Partial<Omit<ServerTableUrlState, 'disabledColumns' | 'enabledColumns'>>
  ) => void;
  tags: string[];
  type?: TypeConfigurationType;
}

export function usePaginatedPolicies({
  policies,
  serverTableUrlState,
  setServerTableUrlState,
  tags,
  type
}: UsePaginatedPoliciesParams) {
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
            const policyMatchManualFilter = filter.value === POLICY_TYPE.MANUAL && isManual(policy);
            const policyMatchAutomaticFilter = filter.value === POLICY_TYPE.AUTOMATIC && isAutomatic(policy);
            return shouldInclude && shouldInclude && (policyMatchManualFilter || policyMatchAutomaticFilter);
          }
          case 'tags':
            return shouldInclude && (policy.tags?.some(tag => filter.value.includes(tag)) ?? false);
        }
      }, true)
    )
  );

  return usePaginatedResult({
    result: filteredPolicies,
    serverTableUrlState,
    setServerTableUrlState,
    searchAttributes: [
      'name',
      'description',
      policy => policy?.tags?.toString() ?? '',
      policy => policy?.trigger?.name ?? '',
      policy => (getActionConfigurationFromPolicy(policy) as ActionConfiguration).action.name
    ],
    sort: policy => {
      const { orderBy } = serverTableUrlState;
      const value = policy[orderBy as keyof Policy];
      if (orderBy === 'trigger') {
        return policy.trigger.name?.trim()?.toLowerCase();
      }
      if (orderBy === 'actionName') {
        return (getActionConfigurationFromPolicy(policy) as ActionConfiguration).action.name?.trim()?.toLowerCase();
      }
      return typeof value === 'string' ? value.trim().toLowerCase() : value;
    }
  });
}
