/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { isUndefined } from 'lodash';

import { getIntlNumberFormatter, NumberFormatter } from '@instana/format-numbers';
import { MetricResult, SloEntityUnion } from '@instana/types';
import { t } from '@instana/i18n-react';

import { valueMissingPlaceholder } from 'in-components/valueMissingPlaceholder';
import { number, NumberFormatterFunction } from 'in-services/formatters/number';
import { SLO_TARGET_DECIMAL_PRECISION } from 'in-service-levels/constants';
import { MetricDataPoint } from 'in-components/Chart/types';

interface FormatSloStatusResponse {
  sloStatus?: string;
  sloTarget?: string;
}

export function formatSloStatus({ status, target }: { status?: number; target?: number }): FormatSloStatusResponse {
  if (isUndefined(status) || isUndefined(target)) {
    return { sloStatus: valueMissingPlaceholder, sloTarget: valueMissingPlaceholder };
  }
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

export function createSloEventFormatter(entity: SloEntityUnion): NumberFormatterFunction {
  return (value: number): string => {
    return t('in-service-levels:general.format.event', {
      context: entity.type,
      count: value,
      formatted: number.compact(value)
    });
  };
}

export function getSingleNumberMetricValue(metric?: MetricResult): number | undefined {
  if (!metric || metric?.values?.length !== 1) {
    return undefined;
  }
  return metric.values[0][1];
}

export function getValueFromSingleValueMetric(metric: MetricDataPoint[] | undefined) {
  return metric?.[0]?.[1];
}
