/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { TimeConfig } from '@instana/types';

export default function updateTimeConfig(timeConfig: TimeConfig) {
  const MAX_WINDOW_SIZE = 15 * 24 * 60 * 60 * 1000;
  const now = Date.now();

  // Determine the effective "to": use timeConfig.to if provided; otherwise default to now.
  const effectiveTo = timeConfig.to != null ? timeConfig.to : now;

  // Calculate the computed "from" based on the provided windowSize.
  // There is no "from" property in the config; it is computed as: from = effectiveTo - windowSize.
  const computedFrom = new Date(effectiveTo - timeConfig.windowSize);
  const thresholdDate = new Date(now - MAX_WINDOW_SIZE); //Threshold date =(now - 15 days)

  const newWindowSize = effectiveTo - thresholdDate.getTime();

  // Decide whether to adjust the configuration:
  //
  // Case I: If computedFrom is NOT older than threshold, then we use the timeConfig as is.
  // Case II: If computedFrom is older than threshold, timeTo greater threshold
  //         then regardless of the original selection (whether the selection ends at now or is entirely historical),
  //         we update the timeConfig as follows:
  //         - to: now
  //         - windowSize: MAX_WINDOW_SIZE (i.e. 15 days)
  //         - focusedMoment: now
  //Case III: If timeTo and timeFrom is older than threshold; show last 15days data
  //Case IV : If data is requested from a date greater than the threshold and to a date greater than now (future date)
  let finalTimeConfig: TimeConfig;

  if (computedFrom < thresholdDate && new Date(effectiveTo) > thresholdDate && new Date(effectiveTo) < new Date(now)) {
    // Adjust configuration as per Case II:
    finalTimeConfig = {
      ...timeConfig,
      to: effectiveTo,
      windowSize: newWindowSize,
      focusedMoment: effectiveTo
    };
  } else if (new Date(effectiveTo) < thresholdDate || (computedFrom < thresholdDate && effectiveTo > now)) {
    //case III : if any date which is less than the threshold is selected  or to is a future date and from is less than threshold
    finalTimeConfig = {
      ...timeConfig,
      to: now,
      windowSize: MAX_WINDOW_SIZE,
      focusedMoment: now
    };
  } else if (computedFrom > thresholdDate && effectiveTo > now) {
    //case IV : from is greater than the threshold and to is a future date then trim the data to computed from to present date
    finalTimeConfig = {
      ...timeConfig,
      to: now,
      windowSize: now - computedFrom.getTime(),
      focusedMoment: now
    };
  } else {
    // Use configuration as is for live , last 5 mins etc (Case I)
    finalTimeConfig = { ...timeConfig };
  }

  return finalTimeConfig;
}
