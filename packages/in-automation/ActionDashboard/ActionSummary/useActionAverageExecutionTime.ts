/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { create, timeout } from '@instana/observables';
import { Result, TimeConfig } from '@instana/types';
import { useObservable } from '@instana/hooks';

import {
  ActionAverageExecutionResult,
  getActionAverageExecutionResult
} from 'in-automation/subscriptions/getActionAvgExecutionTime';
import { pendingResult } from 'in-services/fixedObjects';

const refreshSignal = create().emit(true);
export function averageExecutionTimeRefresh() {
  timeout(0).once(() => refreshSignal.emit(true));
}

export default function useActionAverageExecutionTime(timeConfig: TimeConfig, actionId: string) {
  return (
    useObservable(GetActionAverageExecutionTime, [timeConfig, actionId]) ??
    (pendingResult as Result<ActionAverageExecutionResult>)
  );
}
type GetActionAverageExecutionTimeTuple = [TimeConfig, string];
function GetActionAverageExecutionTime([timeConfig, actionId]: GetActionAverageExecutionTimeTuple) {
  return refreshSignal.flatMap(() =>
    getActionAverageExecutionResult({
      timeConfig,
      actionId
    })
  );
}
