/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { create, interval, Disposable } from '@instana/observables';

import { timeOutSessionEnabled } from 'in-services/featureFlags';

let subscription: Disposable | null;

export const counter$ = create<number>();
export const nextIdleTimeout$ = create<number>();

// Needed for E2E testing.
if (timeOutSessionEnabled) {
  window.instana.dev.resetSessionTimeout = (timeOutInMs: number) => {
    setIdleTimeoutCounter(timeOutInMs);
  };
}

const startCountdownObservable = (countdownTimeInMs: number) => {
  stop();
  if (countdownTimeInMs) {
    subscription = interval(1000)
      .scan(acc => acc - 1000, countdownTimeInMs) // Compute remaining time
      .filter(timeLeft => timeLeft >= 0) // Allow only positive remaining time
      .subscribe(count => {
        counter$.emit(count);
      });
  }
};

function stop() {
  if (subscription) {
    subscription.dispose();
    subscription = null;
  }
}

export const setIdleTimeoutCounter = (timeOutInMs: number) => {
  counter$.emit(timeOutInMs);
  startCountdownObservable(timeOutInMs);
};
