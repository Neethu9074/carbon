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
import usePaginatedResult from 'in-automation/Policies/usePaginatedResult';
import { Policy, Result, TypeConfigurationType } from 'in-types';
import { pendingResult } from 'in-services/fixedObjects';
import { isLoading } from 'in-services/util/result';
import { getPolicies } from 'in-automation/api';

export interface UsePoliciesParams extends Omit<ServerTableUrlState, 'disabledColumns' | 'enabledColumns'> {
  tags?: string[];
  trigger?: TypeConfigurationType | undefined;
}

const refreshSignal = create().emit(true);
export function refresh() {
  refreshSignal.emit(true);
}

export default function usePolicies({
  page,
  pageSize,
  orderBy,
  orderDirection,
  query,
  tags,
  trigger
}: UsePoliciesParams) {
  const policies = useObservable(refreshSignal.flatMap(getPolicies), []) ?? (pendingResult as Result<Policy[]>);

  const filters = [
    {
      key: 'trigger' as const,
      value: trigger
    },
    {
      key: 'tags' as const,
      value: tags
    }
  ];
  const filteredPolicies = isLoading(policies)
    ? policies
    : {
        ...policies,
        data: policies.data?.filter(policy => {
          let shouldInclude = true;
          filters.forEach(filter => {
            const nonEmptyFilter = filter.value
              ? Array.isArray(filter.value)
                ? filter.value.length > 0
                : true
              : false;
            if (filter.key === 'trigger' && nonEmptyFilter) {
              const policyMatchManualFilter = filter.value === MANUAL && isManual(policy);
              const policyMatchAutomaticFilter = filter.value === AUTOMATIC && isAutomatic(policy);
              shouldInclude = shouldInclude && (policyMatchManualFilter || policyMatchAutomaticFilter);
            } else if (filter.key === 'tags' && nonEmptyFilter) {
              shouldInclude = shouldInclude && (policy.tags?.some(tag => filter.value!.includes(tag)) ?? false);
            }
          });
          return shouldInclude;
        })
      };
  const availableTags = [...new Set(policies?.data?.flatMap(({ tags }) => tags ?? []))];
  const result = usePaginatedResult(filteredPolicies, { page, pageSize, orderBy, orderDirection, query }, [
    'name',
    'description',
    policy => policy?.tags?.toString() ?? '',
    policy => policy?.trigger?.name ?? '',
    policy => policy.typeConfigurations[0]?.runnable.runConfiguration.actions[0].action.name
  ]);
  return [resultToFetchedStateResponse(result), availableTags] as const;
}
