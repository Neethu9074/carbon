/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { RRule } from 'rrule';

import { CorrectionConfiguration } from '@instana/types';

import { days, hours, minutes } from 'in-services/time/time';

export function getNextOccurence(config: CorrectionConfiguration) {
  const options = RRule.parseString(config.scheduling?.recurrentRule ?? '');
  const startTime = new Date(config.scheduling?.startTime ?? '');
  options.dtstart = startTime;
  const rRule = new RRule(options);
  const now = new Date();
  const nextOccurrence = rRule.after(now, true);
  return nextOccurrence;
}

export function getDurationInMs(config: CorrectionConfiguration) {
  const { duration = 0, durationUnit } = config.scheduling ?? {};
  const durationInMs =
    durationUnit === 'hour'
      ? hours.toMillis(duration)
      : durationUnit === 'day'
      ? days.toMillis(duration)
      : minutes.toMillis(duration);
  return durationInMs;
}
