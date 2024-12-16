/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { ServiceLevelObjectiveConfiguration } from '@instana/types';
import { t } from '@instana/i18n-react';

import useContextAwareSloTimeWindowConfig from 'in-service-levels/hooks/useContextAwareSloTimeWindowConfig';
import ErrorBudgetChart from 'in-service-levels/components/SloDashboard/components/chart/ErrorBudgetChart';
import SloChartSummary from 'in-service-levels/components/SloChart/SloChartSummary/SloChartSummary';
import useSloWidgetMetrics from 'in-custom-dashboards/widgets/Slo/hooks/useSloWidgetMetrics';
import { getValueFromSingleValueMetric } from 'in-service-levels/utils/format';
import { MetricDataPoint } from 'in-components/Chart/types';

interface SloErrorBudgetWidgetProps {
  sloConfig: ServiceLevelObjectiveConfiguration;
}

export default function SloErrorBudgetWidget({ sloConfig }: SloErrorBudgetWidgetProps) {
  const timeConfig = useContextAwareSloTimeWindowConfig();
  const [metricResult, status] = useSloWidgetMetrics(sloConfig, timeConfig);

  const remainingBudgetNumber = metricResult?.find(metric => metric.id === 'remainingBudgetNumber');
  const statusMetric = metricResult?.find(metric => metric.id === 'statusMetric');
  const metricRemaining = getValueFromSingleValueMetric(remainingBudgetNumber?.values as MetricDataPoint[]);
  const metricSli = getValueFromSingleValueMetric(statusMetric?.values as MetricDataPoint[]);

  return (
    <>
      <SloChartSummary
        budgetSingleNumber={remainingBudgetNumber?.values as MetricDataPoint[]}
        fromTimestamp={sloConfig.timeWindow.type === 'fixed' ? sloConfig.timeWindow.startTimestamp : Date.now()}
        indicatorType={sloConfig.indicator.type}
        metricRemaining={metricRemaining}
        metricSli={metricSli}
        objectiveDuration={sloConfig.timeWindow.duration}
        objectiveDurationUnit={sloConfig.timeWindow.durationUnit}
        sloEntityType={sloConfig.entity.type}
        status={status}
        statusSingleNumber={statusMetric?.values as MetricDataPoint[]}
        target={sloConfig.target}
        timeWindowType={sloConfig.timeWindow.type}
      />
      <ErrorBudgetChart
        configuration={sloConfig}
        title={t('in-service-levels:sloDashboard.components.errorBudgetChart.title')}
      />
    </>
  );
}
