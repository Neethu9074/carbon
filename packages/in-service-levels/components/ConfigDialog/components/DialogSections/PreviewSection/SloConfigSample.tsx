/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useContext } from 'react';

import { Card, HorizontalIndicator } from '@instana/components';
import { themes } from '@instana/design-tokens';

import PreviewChartLeftHeader from 'in-service-levels/components/ConfigDialog/components/DialogSections/PreviewSection/PreviewChartLeftHeader';
import {
  formToSloConfiguration,
  formToTimeWindow
} from 'in-service-levels/components/ConfigDialog/createSloForm/utils';
import { generateSloErrorBudgetSampleMetrics, getErrorBudgetSampleData } from 'in-service-levels/utils/sample';
import ControlledSloErrorBudgetChart from 'in-service-levels/components/Shared/ControlledSloErrorBudgetChart';
import { calculateSloGranularity, calculateTimeConfigFromTimeWindow } from 'in-service-levels/utils/time';
import SloFormContext from 'in-service-levels/components/ConfigDialog/createSloForm/SloFormContext';
import SloChartSummary from 'in-service-levels/components/SloChart/SloChartSummary/SloChartSummary';
import { MetricDataPoint } from 'in-components/Chart/types';
import { parseDateTime } from 'in-services/formatters/date';
import { finishedProgress } from 'in-services/fixedObjects';
import useTimeConfig from 'in-hooks/useTimeConfig';

import locals from './SloConfigPreview.mless';

export default function SloConfigSample() {
  const { form } = useContext(SloFormContext);
  const timeConfig = useTimeConfig();

  const granularity = calculateSloGranularity(timeConfig);

  const entityIds = form.getIn(['entity', 'entityIds']).value;
  const indicatorType = form.getIn(['indicator', 'type']).value;
  const objectiveDate = form.getIn(['objective', 'startTimestamp', 'date']).value;
  const objectiveDuration = form.getIn(['objective', 'duration']).value;
  const objectiveDurationUnit = form.getIn(['objective', 'durationUnit']).value;
  const objectiveTime = form.getIn(['objective', 'startTimestamp', 'time']).value;
  const sloEntityType = form.getIn(['entity', 'type']).value;
  const target = form.getIn(['objective', 'target']).value;
  const timeWindowType = form.getIn(['objective', 'type']).value;

  const fromTimestamp = parseDateTime(`${objectiveDate} ${objectiveTime}`).getTime();
  const timeWindow = formToTimeWindow(form);
  const sloTimeConfig = calculateTimeConfigFromTimeWindow(timeWindow);

  const { status, totalErrorBudget, remainingErrorBudget } = getErrorBudgetSampleData(
    {
      entityIds,
      indicatorType,
      sloTarget: target ?? 0,
      timeWindow
    },
    sloTimeConfig,
    granularity
  );

  const metrics = generateSloErrorBudgetSampleMetrics(
    sloTimeConfig,
    granularity,
    totalErrorBudget,
    remainingErrorBudget
  );

  const budgetSingleNumber: MetricDataPoint[] = [[0, remainingErrorBudget]];
  const totalBudgetSingleNumber: MetricDataPoint[] = [[0, totalErrorBudget]];
  const statusSingleNumber: MetricDataPoint[] = [[0, status]];

  return (
    <Card leftHeaderContent={<PreviewChartLeftHeader status="resolved" />}>
      <HorizontalIndicator progress={finishedProgress} />
      <SloChartSummary
        remainingBudget={budgetSingleNumber}
        totalBudget={totalBudgetSingleNumber}
        fromTimestamp={fromTimestamp}
        indicatorType={indicatorType}
        objectiveDuration={objectiveDuration}
        objectiveDurationUnit={objectiveDurationUnit}
        sloEntityType={sloEntityType}
        status="resolved"
        sloStatus={statusSingleNumber}
        target={target}
        timeWindowType={timeWindowType}
      />
      <div className={locals.chartWrapper}>
        <ControlledSloErrorBudgetChart
          configuration={formToSloConfiguration(form)}
          customHeight={250}
          errors={[]}
          metrics={{ granularity, metrics }}
          progress={{ loading: false }}
          timeConfig={sloTimeConfig}
          timeWindowColors={[themes.default.ids.color.option.blue[400]]}
          timeWindows={[sloTimeConfig]}
        />
      </div>
    </Card>
  );
}
