/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

// export for testing
import { hours, minutes, seconds } from 'in-services/time';
export const validRollups = [
  seconds.toMillis(1),
  seconds.toMillis(5),
  minutes.toMillis(1),
  minutes.toMillis(5),
  hours.toMillis(1)
];

export function getNextValidRollup(granularity) {
  if (granularity < validRollups[0]) {
    return validRollups[0];
  } else if (granularity > validRollups[validRollups.length - 1]) {
    return validRollups[validRollups.length - 1];
  }

  for (let i = 0; i < validRollups.length; i++) {
    if (granularity < validRollups[i]) {
      return validRollups[i];
    } else if (granularity === validRollups[i]) {
      return granularity;
    }
  }
  return validRollups[validRollups.length - 1];
}
