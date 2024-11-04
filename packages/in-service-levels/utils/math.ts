/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { weeksToDays } from 'date-fns';

import { TimeWindow } from '@instana/types';

import { days, hours } from 'in-services/time/time';

/**
 * Emulates a severity value for an slo status.
 * Severities are usually treates as follows
 * s === 0 => Healthy / green
 * 0 < s < 5 => Warning / yellow
 * s >= 5 => Critical / red
 */
export function calculateSeverity({ status, target }: { status: number; target: number }): number {
  if (status >= target) {
    return 0;
  } else {
    return 10;
  }
}

export function calculateAvailableErrorBudget(
  timeWindow: Pick<TimeWindow, 'duration' | 'durationUnit'>,
  target: number
): number {
  const { duration, durationUnit } = timeWindow;

  let minutes = 0;
  switch (durationUnit) {
    case 'day':
      minutes = days.toHours(duration) * hours.toMinutes(1);
      break;
    case 'week':
      minutes = days.toHours(weeksToDays(duration)) * hours.toMinutes(1);
      break;
    case 'month':
      minutes = days.toHours(30 * duration) * hours.toMinutes(1);
      break;
  }

  return Math.round((1 - target) * minutes);
}

export function truncFloat(num: number, decimalCount: number): number {
  const strNum = String(num);
  const [intStr, decStr] = strNum.split('.');

  if ((decStr ?? '').length > decimalCount) {
    return parseFloat(`${intStr}.${decStr.substring(0, decimalCount)}`);
  }

  return num;
}
