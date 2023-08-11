/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { useState } from 'react';

import { create, just, interval, Observable, Subject } from '@instana/observables';
import { TimeConfig } from '@instana/types';

import { timeConfig$ } from 'in-stores/time/config';
import { seconds } from 'in-services/time';

export function useModifiedTimeConfig(isPreview?: boolean): {
  mouseMoveSignal$: Subject<unknown>;
  modifiedTimeConfig$: Observable<TimeConfig>;
} {
  const [mouseMoveSignal$] = useState(create());
  const [modifiedTimeConfig$] = useState(
    timeConfig$
      .flatMap(timeConfig =>
        timeConfig.autoRefresh && !isPreview
          ? mouseMoveSignal$
              .startWith(true)
              .throttle(1000)
              .flatMap(() => interval(seconds.toMillis(10)))
              .map(() => timeConfig)
              .startWith(timeConfig)
          : just(timeConfig)
      )
      .startWith(timeConfig$)
      .map(timeConfig => {
        // make sure, the event view is not updating any data automatically
        const to = (timeConfig as TimeConfig).to || Date.now();
        return {
          to,
          focusedMoment: to,
          autoRefresh: false,
          windowSize: (timeConfig as TimeConfig).windowSize
        };
      })
  );

  return { mouseMoveSignal$, modifiedTimeConfig$ };
}
