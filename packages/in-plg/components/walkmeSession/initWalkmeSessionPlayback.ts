/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { playwithEnabled } from 'in-services/featureFlags';
import { config } from 'in-services/config';

export function init() {
  const { activeLicenseType } = config;
  //@ts-expect-error WalkMeInsightsAPI is loaded during runtime using script
  window.onWalkMeInsightsAPIReady = function () {
    if (playwithEnabled || activeLicenseType === 'selfService')
      //@ts-expect-error WalkMeInsightsAPI is loaded during runtime using script
      WalkMeInsightsAPI?.startPlaybackRecording();
  };
}
