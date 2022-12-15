/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { combineLatest, timeout } from '@instana/observables';

import { pendingResult } from 'in-services/fixedObjects';

export function withTimeout(observable, millis, onTimeout) {
  const timeoutSignal = 'signal';

  return combineLatest([
    observable.startWith(pendingResult),
    timeout(millis)
      .map(() => timeoutSignal)
      .startWith(null)
  ])
    .map(([observable, signal]) =>
      observable === pendingResult && signal === timeoutSignal ? onTimeout() : observable
    )
    .distinct();
}
