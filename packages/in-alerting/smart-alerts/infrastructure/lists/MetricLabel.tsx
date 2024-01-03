/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { AggregationType } from '@instana/types';

import { getFormatter, getMetricFormat } from 'in-alerting/smart-alerts/infrastructure/details/AlertConfigHelper';
import { useGetMetricLabel } from 'in-alerting/smart-alerts/infrastructure/components/InfraAlertChartWrapper';
import { formatMetricValue } from 'in-alerting/smart-alerts/components/utils/metricWithThresholdLabel';
import { t } from 'in-i18n';

interface MetricLabelProps {
  entityType: string;
  metricName: string;
  aggregation: AggregationType;
  humanReadableOperator: string;
  value?: number;
}

export function MetricLabel({
  entityType,
  metricName,
  aggregation,
  humanReadableOperator,
  value
}: MetricLabelProps): JSX.Element {
  const metricLabel = useGetMetricLabel(entityType, metricName, aggregation);
  const formatter = getFormatter(entityType, metricName);
  const metricFormat = getMetricFormat(formatter);
  const formattedValue = value ? formatMetricValue(metricFormat, value) : 0;

  return (
    <>
      {metricLabel
        ? t('in-alerting:smartAlerts.infrastructure.list.columns.name.subtitleForStaticThreshold', {
            metricName: metricLabel,
            operator: humanReadableOperator,
            value: formattedValue
          })
        : t('in-alerting:smartAlerts.infrastructure.list.columns.name.subtitleForStaticThreshold')}
    </>
  );
}
