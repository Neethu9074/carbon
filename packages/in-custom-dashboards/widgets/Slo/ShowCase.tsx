/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { FixedTimeWindow, ServiceLevelObjectiveConfiguration, TimeConfig } from '@instana/types';
import { Card, Stack } from '@instana/components';
import { themes } from '@instana/design-tokens';
import { t } from '@instana/i18n-react';

import ControlledSloErrorBudgetChart from 'in-service-levels/components/Shared/ControlledSloErrorBudgetChart';
import SloChartSummary from 'in-service-levels/components/SloChart/SloChartSummary/SloChartSummary';
import SloWidgetLeftHeader from 'in-custom-dashboards/widgets/Slo/components/SloWidgetLeftHeader';
import { MetricDataPoint, MetricDataSeries } from 'in-components/Chart/types';
import { calculateSloGranularity } from 'in-service-levels/utils/time';
import { days } from 'in-services/time/time';

import locals from './ShowCase.mless';

const currentTime = Date.now();

const showCaseSloConfig: ServiceLevelObjectiveConfiguration = {
  entity: { applicationId: '', type: 'application', boundaryScope: 'ALL' },
  indicator: { blueprint: 'availability', threshold: 0, type: 'eventBased' },
  name: t('in-custom-dashboards:widgets.slo.demo.title'),
  tags: [],
  target: 0.99,
  timeWindow: {
    type: 'fixed',
    durationUnit: 'day',
    duration: 1,
    startTimestamp: currentTime - days.toMillis(1)
  }
};

const staticTimeConfig = { windowSize: days.toMillis(1), autoRefresh: false, to: currentTime };

function generateRandomMetrics(
  { windowSize, to }: TimeConfig,
  granularity: number,
  totalErrorBudget: number,
  remainingBudget: number
): MetricDataSeries[] {
  const startTimestamp = (to ?? currentTime) - windowSize;
  const bucketCount = windowSize / granularity;
  const metricSeries: MetricDataSeries = [];
  const budgetRange = totalErrorBudget - remainingBudget;
  const bucketRange = budgetRange / bucketCount;

  for (let bucketNumber = 0; bucketNumber <= bucketCount; bucketNumber++) {
    const bucketTime = startTimestamp + granularity * bucketNumber;
    const minRemainingBudget = totalErrorBudget - bucketRange * bucketNumber;
    const maxRemainingBudget = totalErrorBudget - bucketRange * (bucketNumber + 1);
    const newRemainingBudget = Math.round(
      Math.random() * (maxRemainingBudget - minRemainingBudget) + maxRemainingBudget
    );
    const newBucket: MetricDataPoint = [bucketTime, newRemainingBudget];
    metricSeries.push(newBucket);
  }

  return [metricSeries];
}

export default function ShowCase() {
  const totalErrorBudget = 126534745;
  const consumedErrorBudget = 22544645;
  const remainingErrorBudget = totalErrorBudget - consumedErrorBudget;
  const timeWindow = showCaseSloConfig.timeWindow as FixedTimeWindow;
  const sloStatus = remainingErrorBudget / totalErrorBudget;
  // Prevents JS rounding errors
  const clampedStatus = sloStatus < 1 ? parseFloat(String(sloStatus).substring(0, 6)) : sloStatus;
  const granularity = calculateSloGranularity(staticTimeConfig);
  const metrics = generateRandomMetrics(staticTimeConfig, granularity, totalErrorBudget, remainingErrorBudget);

  return (
    <div className={locals.wrapper}>
      <Card
        leftHeaderContent={
          <SloWidgetLeftHeader
            sloConfig={showCaseSloConfig}
            title={t('in-custom-dashboards:widgets.slo.general.demoWidgetTitle')}
          />
        }
      >
        <Stack>
          <SloChartSummary
            budgetSingleNumber={[[0, totalErrorBudget]]}
            fromTimestamp={timeWindow.startTimestamp}
            indicatorType={showCaseSloConfig.indicator.type}
            metricRemaining={remainingErrorBudget}
            metricSli={sloStatus}
            objectiveDuration={showCaseSloConfig.timeWindow.duration}
            objectiveDurationUnit={showCaseSloConfig.timeWindow.durationUnit}
            showRemainingBudget
            sloEntityType={showCaseSloConfig.entity.type}
            status="resolved"
            statusSingleNumber={[[0, clampedStatus]]}
            target={showCaseSloConfig.target}
            timeWindowType={showCaseSloConfig.timeWindow.type}
          />
          <ControlledSloErrorBudgetChart
            configuration={showCaseSloConfig}
            errors={[]}
            progress={{ loading: false }}
            timeConfig={staticTimeConfig}
            timeWindows={[staticTimeConfig]}
            timeWindowColors={[themes.default.ids.color.option.blue[400]]}
            metrics={{
              granularity,
              metrics
            }}
          />
        </Stack>
      </Card>
    </div>
  );
}
