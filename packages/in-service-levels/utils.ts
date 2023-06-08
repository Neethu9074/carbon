/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { weeksToDays } from 'date-fns';
import { isUndefined } from 'lodash';

import { MetricResult, TimeConfig, TimeWindow, AdjustedTimeframe } from '@instana/types';
import { getIntlNumberFormatter, NumberFormatter } from '@instana/format-numbers';

import { valueMissingPlaceholder } from 'in-components/valueMissingPlaceholder';
import { SLO_TARGET_DECIMAL_PRECISION } from 'in-service-levels/constants';
import { days, hours, minutes } from 'in-services/time';

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

interface FormatSloStatusResponse {
  sloStatus?: string;
  sloTarget?: string;
}

export function formatSloStatus({ status, target }: { status?: number; target?: number }): FormatSloStatusResponse {
  if (isUndefined(status) || isUndefined(target)) return {};
  const format = createSloPercentageFormatter(target);
  return {
    sloStatus: format(status) ?? valueMissingPlaceholder,
    sloTarget: format(target) ?? valueMissingPlaceholder
  };
}

export function createSloPercentageFormatter(sloTarget: number): NumberFormatter {
  const minimumFractionDigits = 2;
  const hundredthsDigits = 2;

  // Determines the current decimal places and increments the decimals by one, if necessary,
  // to inform the user whether the specified target has been exceeded.
  const numberStr = sloTarget.toFixed(SLO_TARGET_DECIMAL_PRECISION + hundredthsDigits + 2);
  const decimalCount = numberStr.split('.')[1].replace(/0+$/, '').length - hundredthsDigits;
  const displayedFractionDigits = Math.max(decimalCount + 1, minimumFractionDigits);

  return getIntlNumberFormatter({
    minimumFractionDigits,
    maximumFractionDigits: displayedFractionDigits,
    style: 'percent'
  });
}

export function calculateSloGranularity(timeConfig: TimeConfig): number {
  const now = Date.now();
  const toOrNow = timeConfig.to ?? now;
  const from = toOrNow - timeConfig.windowSize;
  const oneDay = days.toMillis(1);

  if (timeConfig.windowSize < oneDay && from > now - oneDay) {
    // if timeframe is within the last 24 hours, and window-size less than a day, then request metric in
    // one minute granularity. We do not want to query CH with oneMinute granularity with large windowSize as
    // this would lead to performance problems.
    return minutes.toMillis(1);
  }
  return hours.toMillis(1);
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
  }

  return Math.round((1 - target) * minutes);
}

export function calculateTimeRemaining(timeConfig: TimeConfig): number {
  const now = Date.now();
  const to = timeConfig.to ?? now;
  return to - now;
}

export function getSingleNumberMetricValue(metric?: MetricResult): number | undefined {
  if (!metric || metric.values.length !== 1) {
    return undefined;
  }
  return metric.values[0][1];
}

export function applyAdjustedTimeframe(timeConfig: TimeConfig, adjustedTimeframe?: AdjustedTimeframe): TimeConfig {
  return {
    ...timeConfig,
    ...(adjustedTimeframe ?? {}),
    focusedMoment: timeConfig.focusedMoment ?? adjustedTimeframe?.to
  };
}
