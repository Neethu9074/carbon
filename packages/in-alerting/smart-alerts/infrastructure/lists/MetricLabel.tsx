/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { AggregationType } from '@instana/types';

import { useGetMetricLabel } from 'in-alerting/smart-alerts/infrastructure/components/InfraAlertChartWrapper';
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

  return (
    <>
      {metricLabel
        ? t('in-alerting:smartAlerts.infrastructure.list.columns.name.subtitleForStaticThreshold', {
            metricName: metricLabel,
            operator: humanReadableOperator,
            value
          })
        : t('in-alerting:smartAlerts.infrastructure.list.columns.name.subtitleForStaticThreshold')}
    </>
  );
}
