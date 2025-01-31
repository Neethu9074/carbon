/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { just } from '@instana/observables';

import { amplitudeExperimentEnabled } from 'in-services/featureFlags';

export function init() {
  if (amplitudeExperimentEnabled) {
    // the initialisation happens in this module itself.
    require('promise-loader?global,initAmplitudeExperiment!in-services/experiments/amplitude/amplitudeInit');
  }
  return just(true);
}
