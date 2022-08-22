/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { TimeConfig } from '@instana/types';

import { days } from 'in-services/time';

const retentionPeriod = days.toMillis(90);

export default function useApdexRetentionPeriodCheck(timeConfig: TimeConfig): boolean {
  if (!timeConfig.to) {
    return timeConfig.windowSize <= retentionPeriod;
  }

  const from = timeConfig.to - timeConfig.windowSize;
  return !(Date.now() - from > retentionPeriod);
}
