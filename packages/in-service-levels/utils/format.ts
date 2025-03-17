/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { isUndefined } from 'lodash';

import { getIntlNumberFormatter, NumberFormatter } from '@instana/format-numbers';
import { MetricResult, SloEntityUnion } from '@instana/types';

import { valueMissingPlaceholder } from 'in-components/valueMissingPlaceholder';
import { number, NumberFormatterFunction } from 'in-services/formatters/number';
import { SLO_TARGET_DECIMAL_PRECISION } from 'in-service-levels/constants';
import { MetricDataPoint } from 'in-components/Chart/types';
import { t } from 'in-i18n';

interface FormatSloStatusResponse {
  sloStatus?: string;
  sloTarget?: string;
}

export function formatSloStatus({
  status,
  target,
  precision = SLO_TARGET_DECIMAL_PRECISION
}: {
  status?: number;
  target?: number;
  precision?: number;
}): FormatSloStatusResponse {
  if (isUndefined(status) || isUndefined(target)) {
    return { sloStatus: valueMissingPlaceholder, sloTarget: valueMissingPlaceholder };
  }
  const format = createSloPercentageFormatter(precision);
  return {
    sloStatus: format(status) ?? valueMissingPlaceholder,
    sloTarget: format(target) ?? valueMissingPlaceholder
  };
}

export function createSloPercentageFormatter(precision = SLO_TARGET_DECIMAL_PRECISION): NumberFormatter {
  return getIntlNumberFormatter({
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
    //@ts-expect-error roundingMode is supported in all major browser version of last two years but not part of types yet
    roundingMode: 'trunc',
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
