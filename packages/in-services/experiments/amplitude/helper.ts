/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { createExperimentClient } from 'in-services/experiments/amplitude/amplitudeInit';

/** Function to trigger AB testing */
export function experimentVariantData(flagKey: string) {
  const experimentResult = createExperimentClient();
  const variant = experimentResult?.variant(flagKey);
  return variant;
}
