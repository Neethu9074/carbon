/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import type { ExperimentClient, ExperimentUser, Exposure } from '@amplitude/experiment-js-client';
import { Experiment } from '@amplitude/experiment-js-client';

import { createLogger } from '@instana/logger';

import { amplitudeExperimentEnabled } from 'in-services/featureFlags';
import { customRealmName } from 'in-services/util/constants';
import { user } from 'in-stores/user';

/** Initialize the experiment client and implement an exposure tracking provider with segment */
export function createExperimentClient(): ExperimentClient | undefined {
  if (!amplitudeExperimentEnabled) {
    return;
  }
  if (!window.analytics) {
    return;
  }
  //@ts-expect-error atm config is not defined
  const apiKey: string = window.instana.config.amplitudeKey;
  if (!apiKey) return;

  return Experiment.initialize(apiKey, {
    automaticExposureTracking: true,
    exposureTrackingProvider: {
      track: (exposure: Exposure) => {
        window.analytics.track('Amplitude Experiment Exposure', exposure);
      }
    }
  });
}

const logger = createLogger('amplitude');

/** Only needs to be run once, when starting the product */
const startExperiment = () => {
  //@ts-expect-error atm config is not defined
  const apiKey: string = window.instana.config.amplitudeKey;

  if (!apiKey) return;
  if (!user) return;
  if (!window.analytics) {
    return;
  }

  const exp = createExperimentClient();

  const expUser: ExperimentUser = {
    //@ts-expect-error id is and unoffical field, which is not -yet- part of the global type
    user_id: customRealmName + '-' + user.id
  };
  exp?.start(expUser).catch((error: Error | undefined) => {
    logger.error('starting experiment, loading latest config fails.', error);
  });
};

/**
 * This is actually do in the initialisation.
 *
 * It might require further error handling,
 * and ideally will load or store the feature-flags (tbd.)
 */
startExperiment();
