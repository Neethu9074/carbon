/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { AggregationType, ForecastingConfig } from '@instana/types';

import { getFormatter, getMetricFormat } from 'in-alerting/smart-alerts/infrastructure/details/AlertConfigHelper';
import { useGetMetricLabel } from 'in-alerting/smart-alerts/infrastructure/components/InfraAlertChartWrapper';
import { formatMetricValue } from 'in-alerting/smart-alerts/components/utils/metricWithThresholdLabel';
import { t } from 'in-i18n';

interface MetricLabelProps {
  entityType: string;
  metricName: string;
  aggregation: AggregationType;
  humanReadableOperator: string;
  value: number;
  forecastingConfig: ForecastingConfig | null;
}

export function MetricLabel({
  entityType,
  metricName,
  aggregation,
  humanReadableOperator,
  value,
  forecastingConfig
}: MetricLabelProps): JSX.Element {
  const metricLabel = useGetMetricLabel(entityType, metricName, aggregation);
  const formatter = getFormatter(entityType, metricName);
  const metricFormat = getMetricFormat(formatter);
  const formattedValue = formatMetricValue(metricFormat, value);

  const subtitleElements = [t('in-alerting:smartAlerts.infrastructure.list.columns.name.subtitle.staticThresholdType')];

  if (metricLabel) {
    subtitleElements.push(
      t('in-alerting:smartAlerts.infrastructure.list.columns.name.subtitle.metricThresholdValue', {
        metricName: metricLabel,
        operator: humanReadableOperator,
        value: formattedValue
      })
    );
  }

  if (forecastingConfig != null) {
    subtitleElements.push(
      t('in-alerting:smartAlerts.infrastructure.list.columns.name.subtitle.forecastAlerting', {
        metricName: metricLabel,
        operator: humanReadableOperator,
        value: formattedValue
      })
    );
  }

  return <>{subtitleElements.join(', ')}</>;
}
