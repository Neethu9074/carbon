/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { ForecastingConfig, InfraAlertRuleUnion, ThresholdConfigUnion } from '@instana/types';

import { humanReadableThresholdOperator } from 'in-alerting/smart-alerts/components/dialog/advanced/thresholdFormData';
import { getFormatter, getMetricFormat } from 'in-alerting/smart-alerts/infrastructure/details/AlertConfigHelper';
import { useGetMetricLabel } from 'in-alerting/smart-alerts/infrastructure/components/InfraAlertChartWrapper';
import { formatMetricValue } from 'in-alerting/smart-alerts/components/utils/metricWithThresholdLabel';
import { ADAPTIVE_BASELINE, STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { t } from 'in-i18n';

interface ThresholdInfoProps {
  rule: InfraAlertRuleUnion;
  threshold: ThresholdConfigUnion & { value?: number };
  forecastingConfig?: ForecastingConfig;
}

export function MetricLabel({ rule, threshold, forecastingConfig }: ThresholdInfoProps): JSX.Element {
  const { type, operator, value } = threshold;
  const { entityType, metricName, aggregation } = rule;

  const metricLabel = useGetMetricLabel(entityType, metricName, aggregation);

  if (type === STATIC_THRESHOLD) {
    const humanReadableOperator = humanReadableThresholdOperator(operator);
    const formatter = getFormatter(entityType, metricName);
    const metricFormat = getMetricFormat(formatter, value ?? 0);
    const formattedValue = formatMetricValue(metricFormat, value ?? 0);
    const subtitleElements = [
      t('in-alerting:smartAlerts.infrastructure.list.columns.name.subtitle.staticThresholdType')
    ];

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
  } else if (type === ADAPTIVE_BASELINE) {
    return (
      <>
        {t('in-alerting:smartAlerts.infrastructure.list.columns.name.subtitle.adaptiveThreshold', {
          metricName: metricLabel
        })}
      </>
    );
  }
  throw new Error('Not yet supported threshold type: ' + type);
}
