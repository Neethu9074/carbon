/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { create, timeout } from '@instana/observables';
import { Event, Policy, Result } from '@instana/types';
import { useObservable } from '@instana/hooks';

import { getTriggerIdFromEvent, getTriggerTypeFromEvent } from 'in-automation/AutomationCard/shared';
import { ServerTableUrlState } from 'in-components/tables/ServerTable/hooks/useServerTableUrlState';
import { setActiveKey } from 'in-automation/AutomationCard/AutomationCardButtonGroup';
import usePaginatedResult from 'in-automation/hooks/usePaginatedResult';
import { getPoliciesForTrigger } from 'in-automation/api';
import { pendingResult } from 'in-services/fixedObjects';

interface UsePoliciesParams {
  event: Event;
}

const refreshSignal = create().emit(true);
export function refresh() {
  timeout(1000).once(() => refreshSignal.emit(true));
}

export default function usePolicies({ event }: UsePoliciesParams) {
  const triggerId = getTriggerIdFromEvent(event);
  const triggerType = getTriggerTypeFromEvent(event);
  const result =
    useObservable(
      () =>
        refreshSignal
          .flatMap(() => getPoliciesForTrigger(triggerId, triggerType))
          .tap(policies => {
            if (policies?.data?.length === 0) {
              setActiveKey('recommendedActions');
            }
          }),
      []
    ) ?? (pendingResult as Result<Policy[]>);
  return result;
}

interface UsePaginatedPoliciesParams {
  serverTableUrlState: Omit<ServerTableUrlState, 'disabledColumns' | 'enabledColumns'>;
  setServerTableUrlState: (
    serverTableUrlState: Partial<Omit<ServerTableUrlState, 'disabledColumns' | 'enabledColumns'>>
  ) => void;
  policies: Result<Policy[]>;
}

export function usePaginatedPolicies({
  policies,
  serverTableUrlState,
  setServerTableUrlState
}: UsePaginatedPoliciesParams) {
  const result = usePaginatedResult({
    result: policies,
    setServerTableUrlState,
    serverTableUrlState,
    searchAttributes: ['name', 'description', policy => policy?.tags?.toString() ?? '']
  });
  return result;
}
