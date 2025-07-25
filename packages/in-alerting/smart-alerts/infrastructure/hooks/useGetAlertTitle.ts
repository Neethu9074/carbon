/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { MapForm } from 'formalistic';

import { AggregationType } from '@instana/types';

import { getTitlePlaceholder, getDescriptionPlaceholder } from 'in-alerting/smart-alerts/infrastructure/form/formUtils';
import { getFormatter, getMetricFormat } from 'in-alerting/smart-alerts/infrastructure/details/AlertConfigHelper';
import { useGetMetricLabel } from 'in-alerting/smart-alerts/infrastructure/components/InfraAlertChartWrapper';
import { formatMetricValue } from 'in-alerting/smart-alerts/components/utils/metricWithThresholdLabel';
import { NumberFormatter } from 'in-services/formatters/number';
import { getPluginName } from 'in-sdk/pluginName';
import { t } from 'in-i18n';

export function useGetAlertTitle(entityType: string, metric: string, aggregation: AggregationType) {
  const metricLabel = useGetMetricLabel(entityType, metric, aggregation);
  const entityName = getPluginName(entityType, 1);

  if (!metricLabel || !entityName) {
    return null;
  }
  return `${entityName} - ${metricLabel}`;
}

export function useFormattedThresholdValue(
  metricLabel: string | null,
  thresholdOperator: string,
  metricFormat: NumberFormatter,
  warningThreshold: number,
  criticalThreshold: number
) {
  if (!metricLabel) {
    return { WARNING: getDescriptionPlaceholder(), CRITICAL: undefined };
  }

  const operator = warningThreshold != null || criticalThreshold != null ? thresholdOperator : null;

  const warningThresholdFormattedValue = formatMetricValue(metricFormat, warningThreshold);
  const criticalThresholdFormattedValue = formatMetricValue(metricFormat, criticalThreshold);
  const warningThresholdDescription = getThresholdsLowerOrHigherOperatorText(
    operator,
    metricLabel,
    warningThresholdFormattedValue
  );
  const criticalThresholdDescription = getThresholdsLowerOrHigherOperatorText(
    operator,
    metricLabel,
    criticalThresholdFormattedValue
  );
  return { WARNING: warningThresholdDescription, CRITICAL: criticalThresholdDescription };
}

export function getThresholdsLowerOrHigherOperatorText(
  operator: string | null,
  metricLabel: string,
  thresholdValue: string
) {
  switch (operator) {
    case '>':
      return t('in-alerting:smartAlerts.infrastructure.descriptionIsHigherThan', {
        metricName: metricLabel,
        value: thresholdValue
      });
    case '>=':
      return t('in-alerting:smartAlerts.infrastructure.descriptionIsHigherOrEqualTo', {
        metricName: metricLabel,
        value: thresholdValue
      });
    case '<':
      return t('in-alerting:smartAlerts.infrastructure.descriptionIsLowerThan', {
        metricName: metricLabel,
        value: thresholdValue
      });
    case '<=':
      return t('in-alerting:smartAlerts.infrastructure.descriptionIsLowerThanOrEqualTo', {
        metricName: metricLabel,
        value: thresholdValue
      });
    default:
      return getDescriptionPlaceholder();
  }
}

export function generateTitle(label: string | null): string {
  if (!label) {
    return getTitlePlaceholder();
  }
  return t('in-alerting:smartAlerts.infrastructure.placeholderTitle', {
    metricName: label
  });
}

export function getTitlePlaceholderData(form: MapForm<any>) {
  const entityType = form.get('rule')?.get('entityType')?.value;
  const metric = form.get('rule')?.get('metricName')?.value;
  const aggregation = form.get('rule').get('aggregation')?.value;
  const thresholdOperator = form.get('threshold').get('operator').value;

  const thresholdType = form.get('threshold').get('warningThreshold').get('type')?.value;
  const warningThreshold = form.get('threshold').get('warningThreshold').get('value')?.value;
  const criticalThreshold = form.get('threshold').get('criticalThreshold').get('value')?.value;

  const formatter = getFormatter(entityType, metric);
  const metricFormat: NumberFormatter = getMetricFormat(formatter, warningThreshold ?? criticalThreshold);

  return {
    aggregation,
    warningThreshold,
    criticalThreshold,
    thresholdOperator,
    metricFormat,
    metric,
    entityType,
    thresholdType
  };
}
