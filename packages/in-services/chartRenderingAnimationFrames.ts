/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { create, Subject } from '@instana/observables';

import requestAnimationFrameWithFps from 'in-components/Chart/requestAnimationFrameWithFps';

export interface Signal {
  timeSinceLastAnimationDurationPassed: number;
  prev: number;
  now: number;
  progress: number;
}

const streams = new Map<number, Subject<Signal>>();
export function getAnimationFramesWithAnAnimationDurationOf(animationDuration: number): Subject<Signal> {
  const signal$ = streams.get(animationDuration);
  if (signal$) {
    return signal$;
  }

  const animateSignal$ = create<Signal>();

  let prev = Date.now();
  function update() {
    const now = Date.now();
    const timeSinceLastAnimationDurationPassed = now - prev;
    if (timeSinceLastAnimationDurationPassed >= animationDuration) {
      prev += timeSinceLastAnimationDurationPassed;
    }
    const progress = timeSinceLastAnimationDurationPassed / animationDuration;
    animateSignal$.emit({ timeSinceLastAnimationDurationPassed, prev, now, progress });
  }
  requestAnimationFrameWithFps(update, 15); // 15 = fps

  streams.set(animationDuration, animateSignal$);
  return animateSignal$;
}
