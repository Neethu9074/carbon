/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { defaultGranularity } from 'in-alerting/PotentialProblems/constants';
import { days } from 'in-services/time';

/* This function is implemented after the respective backend function.
   See: https://github.com/instana/backend/blob/c27424b3a0b64ea38169f102450c721292184e84/ui-backend/src/main/java/com/instana/ui/service/smartAlerts/application/ApplicationPotentialProblemsService.java#L86
*/
export default function isOutsideCallsShortTermStorage(globalTimeConfig) {
  const now = Date.now();
  const granularity = defaultGranularity;
  const to = globalTimeConfig.to ?? now;
  const windowSize = globalTimeConfig.windowSize;
  const originalFrom = to - windowSize;
  let adjustedFrom = originalFrom - (originalFrom % granularity);

  if (adjustedFrom < originalFrom) {
    // If the first bucket was shifted to the left, drop it, otherwise it might slip outside the
    // short term retention storage (7 days by default) for "last 7 days" time frame and thus force
    // usage of the less precise long term retention storage.
    adjustedFrom = adjustedFrom + granularity;
  }

  const shortTermCutoff = now - days.toMillis(7);
  return adjustedFrom < shortTermCutoff;
}
