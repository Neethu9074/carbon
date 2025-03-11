/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { ActionInstance, PaginatedResult, Result, TimeConfig } from '@instana/types';
import { create, timeout } from '@instana/observables';
import { useObservable } from '@instana/hooks';

import getActionInstances from 'in-automation/subscriptions/getActionInstances';
import { pendingResult } from 'in-services/fixedObjects';

const refreshSignal = create().emit(true);
export function numberOfRunDataRefresh() {
  timeout(0).once(() => refreshSignal.emit(true));
}

export default function useActionNumberOfRunData(timeConfig: TimeConfig, actionId: string) {
  return (
    useObservable(GetActionNumberOfRun, [timeConfig, actionId]) ??
    (pendingResult as Result<PaginatedResult<ActionInstance>>)
  );
}
type GetActionNumberOfRunTuple = [TimeConfig, string];
function GetActionNumberOfRun([timeConfig, actionId]: GetActionNumberOfRunTuple) {
  return refreshSignal.flatMap(() =>
    getActionInstances({
      pagination: {
        page: 1,
        pageSize: 20
      },
      order: {
        by: 'startDate',
        direction: 'DESC'
      },
      timeConfig: timeConfig,
      actionIds: [actionId],
      actionStatuses: []
    })
  );
}
