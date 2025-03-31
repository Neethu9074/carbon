/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { ServiceLevelObjectiveConfiguration } from '@instana/types';

import ContextAwareSloWidgetRightHeader from 'in-custom-dashboards/widgets/Slo/components/ContextAwareSloWidgetRightHeader';
import IndicatorChart from 'in-service-levels/components/SloDashboard/components/chart/IndicatorChart/IndicatorChart';
import useContextAwareSloTimeWindowConfig from 'in-service-levels/hooks/useContextAwareSloTimeWindowConfig';
import ErrorBudgetChart from 'in-service-levels/components/SloDashboard/components/chart/ErrorBudgetChart';
import SloChartSummary from 'in-service-levels/components/SloChart/SloChartSummary/SloChartSummary';
import SloWidgetLeftHeader from 'in-custom-dashboards/widgets/Slo/components/SloWidgetLeftHeader';
import useSloWidgetMetrics from 'in-custom-dashboards/widgets/Slo/hooks/useSloWidgetMetrics';
import SloWidgetCard from 'in-custom-dashboards/widgets/Slo/components/SloWidgetCard';
import { SloWidgetConfiguration } from 'in-custom-dashboards/widgets/Slo/types';
import { getValueFromSingleValueMetric } from 'in-service-levels/utils/format';
import { MetricDataPoint } from 'in-components/Chart/types';

interface SloWidgetPresenterProps {
  actions: React.ReactNode;
  config: SloWidgetConfiguration;
  dragHandle: React.ReactNode;
  isInModal?: boolean;
  isPreview?: boolean;
  title: string;
  sloConfig: ServiceLevelObjectiveConfiguration;
}

export default function SloWidget({
  actions,
  dragHandle,
  config,
  isInModal,
  isPreview,
  title,
  sloConfig
}: SloWidgetPresenterProps) {
  const timeConfig = useContextAwareSloTimeWindowConfig();
  const [metricResult, status, , progress] = useSloWidgetMetrics(sloConfig, timeConfig);

  const remainingBudget = metricResult?.find(metric => metric.id === 'remainingBudget');
  const sloStatus = metricResult?.find(metric => metric.id === 'sloStatus');
  const totalBudget = metricResult?.find(metric => metric.id === 'totalBudget');
  const metricRemaining = getValueFromSingleValueMetric(remainingBudget?.values as MetricDataPoint[]);
  const metricSli = getValueFromSingleValueMetric(sloStatus?.values as MetricDataPoint[]);

  return (
    <SloWidgetCard
      isInModal={isInModal}
      leftHeaderContent={<SloWidgetLeftHeader sloConfig={sloConfig} isPreview={isPreview} title={title} />}
      progress={progress}
      rightHeaderContent={<ContextAwareSloWidgetRightHeader actions={actions} dragHandle={dragHandle} />}
    >
      <SloChartSummary
        totalBudget={totalBudget?.values as MetricDataPoint[]}
        remainingBudget={remainingBudget?.values as MetricDataPoint[]}
        fromTimestamp={sloConfig.timeWindow.type === 'fixed' ? sloConfig.timeWindow.startTimestamp : Date.now()}
        indicatorType={sloConfig.indicator.type}
        metricRemaining={metricRemaining}
        metricSli={metricSli}
        objectiveDuration={sloConfig.timeWindow.duration}
        objectiveDurationUnit={sloConfig.timeWindow.durationUnit}
        sloEntityType={sloConfig.entity.type}
        status={status}
        sloStatus={sloStatus?.values as MetricDataPoint[]}
        target={sloConfig.target}
        timeWindowType={sloConfig.timeWindow.type}
      />
      {config.chartType === 'ERROR_BUDGET' ? (
        <ErrorBudgetChart configuration={sloConfig} automaticallySize={!isPreview} />
      ) : (
        <IndicatorChart
          configuration={sloConfig}
          entity={sloConfig.entity}
          indicator={sloConfig.indicator}
          automaticallySize={!isPreview}
        />
      )}
    </SloWidgetCard>
  );
}
