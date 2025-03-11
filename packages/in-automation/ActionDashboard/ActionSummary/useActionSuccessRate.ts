/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { create, timeout } from '@instana/observables';
import { Result, TimeConfig } from '@instana/types';
import { useObservable } from '@instana/hooks';

import { ActionSuccessRateResult, getActionSuccessRate } from 'in-automation/subscriptions/getActionSuccessRate';
import { pendingResult } from 'in-services/fixedObjects';

const refreshSignal = create().emit(true);
export function actionSuccessRateRefresh() {
  timeout(0).once(() => refreshSignal.emit(true));
}

export default function useActionSuccessRate(timeConfig: TimeConfig, actionId: string) {
  return (
    useObservable(GetActionSuccessRate, [timeConfig, actionId]) ?? (pendingResult as Result<ActionSuccessRateResult>)
  );
}
type GetActionSuccessRateTuple = [TimeConfig, string];
function GetActionSuccessRate([timeConfig, actionId]: GetActionSuccessRateTuple) {
  return refreshSignal.flatMap(() =>
    getActionSuccessRate({
      timeConfig,
      actionId
    })
  );
}
