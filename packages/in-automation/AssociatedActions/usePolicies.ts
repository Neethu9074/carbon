/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { useObservable } from '@instana/hooks';
import { create } from '@instana/observables';

import { ServerTableUrlState } from 'in-components/tables/ServerTable/hooks/useServerTableUrlState';
import { resultToFetchedStateResponse } from 'in-hooks/utils/resultToFetchedStateResponse';
import usePaginatedResult from 'in-automation/Policies/usePaginatedResult';
import { getPoliciesForTrigger } from 'in-automation/api';
import { pendingResult } from 'in-services/fixedObjects';
import { isLoading } from 'in-services/util/result';
import { Policy, Result } from 'in-types';

export interface UsePoliciesParams extends Omit<ServerTableUrlState, 'disabledColumns' | 'enabledColumns'> {
  tags?: string[];
  trigger?: 'manual' | 'automatic' | undefined;
  triggerDetails: { triggerId: string; triggerType: any };
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
  triggerDetails
}: UsePoliciesParams) {
  const policies =
    useObservable(
      () => getPoliciesForTrigger(triggerDetails.triggerId, triggerDetails.triggerType),
      [triggerDetails]
    ) ?? (pendingResult as Result<Policy[]>);
  const filteredPolicies = isLoading(policies)
    ? policies
    : {
        ...policies,
        data: policies?.data
      };
  const result = usePaginatedResult(filteredPolicies, { page, pageSize, orderBy, orderDirection, query }, [
    'name',
    'description',
    policy => policy?.tags?.toString() ?? ''
  ]);
  return [resultToFetchedStateResponse(result)] as const;
}
