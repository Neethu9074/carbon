import { create } from '@instana/observables';

import requestAnimationFrameWithFps from 'in-components/Chart/requestAnimationFrameWithFps';

const streams = {};
export function getAnimationFramesWithAnAnimationDurationOf(animationDuration) {
  if (streams[animationDuration]) {
    return streams[animationDuration];
  }

  const animateSignal$ = create();

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

  streams[animationDuration] = animateSignal$;
  return animateSignal$;
}
