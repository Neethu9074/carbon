/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { FixedTimeWindow, ServiceLevelObjectiveConfiguration } from '@instana/types';
import { themes } from '@instana/design-tokens';

import ControlledSloErrorBudgetChart from 'in-service-levels/components/Shared/ControlledSloErrorBudgetChart';
import SloChartSummary from 'in-service-levels/components/SloChart/SloChartSummary/SloChartSummary';
import SloWidgetLeftHeader from 'in-custom-dashboards/widgets/Slo/components/SloWidgetLeftHeader';
import SloWidgetCard from 'in-custom-dashboards/widgets/Slo/components/SloWidgetCard';
import { generateSloErrorBudgetSampleMetrics } from 'in-service-levels/utils/sample';
import { calculateSloGranularity } from 'in-service-levels/utils/time';
import { finishedProgress } from 'in-services/fixedObjects';
import { truncFloat } from 'in-service-levels/utils/math';
import { days } from 'in-services/time/time';
import { t } from 'in-i18n';

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

export default function ShowCase() {
  const totalErrorBudget = 126534745;
  const consumedErrorBudget = 22544645;
  const remainingErrorBudget = totalErrorBudget - consumedErrorBudget;
  const timeWindow = showCaseSloConfig.timeWindow as FixedTimeWindow;
  const sloStatus = remainingErrorBudget / totalErrorBudget;
  // Prevents JS rounding errors
  const truncatedStatus = sloStatus < 1 ? truncFloat(sloStatus, 2) : sloStatus;
  const granularity = calculateSloGranularity(staticTimeConfig);
  const metrics = generateSloErrorBudgetSampleMetrics(
    staticTimeConfig,
    granularity,
    totalErrorBudget,
    remainingErrorBudget
  );

  return (
    <div className={locals.wrapper}>
      <SloWidgetCard
        leftHeaderContent={
          <SloWidgetLeftHeader
            sloConfig={showCaseSloConfig}
            title={t('in-custom-dashboards:widgets.slo.general.demoWidgetTitle')}
          />
        }
        progress={finishedProgress}
      >
        <SloChartSummary
          remainingBudget={[[0, remainingErrorBudget]]}
          totalBudget={[[0, totalErrorBudget]]}
          fromTimestamp={timeWindow.startTimestamp}
          indicatorType={showCaseSloConfig.indicator.type}
          metricRemaining={remainingErrorBudget}
          metricSli={sloStatus}
          objectiveDuration={showCaseSloConfig.timeWindow.duration}
          objectiveDurationUnit={showCaseSloConfig.timeWindow.durationUnit}
          sloEntityType={showCaseSloConfig.entity.type}
          status="resolved"
          sloStatus={[[0, truncatedStatus]]}
          target={showCaseSloConfig.target}
          timeWindowType={showCaseSloConfig.timeWindow.type}
        />
        <ControlledSloErrorBudgetChart
          customHeight={250}
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
      </SloWidgetCard>
    </div>
  );
}
