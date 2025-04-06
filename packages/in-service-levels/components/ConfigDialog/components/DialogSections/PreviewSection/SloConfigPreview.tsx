/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useContext } from 'react';

import { Card, HorizontalIndicator } from '@instana/components';
import { themes } from '@instana/design-tokens';

import PreviewChartLeftHeader from 'in-service-levels/components/ConfigDialog/components/DialogSections/PreviewSection/PreviewChartLeftHeader';
import SloFormContext from 'in-service-levels/components/ConfigDialog/createSloForm/SloFormContext';
import SloChartSummary from 'in-service-levels/components/SloChart/SloChartSummary/SloChartSummary';
import { applyAdjustedTimeframe, calculateSloGranularity } from 'in-service-levels/utils/time';
import useSloPreviewMetrics from 'in-service-levels/hooks/useSloPreviewMetrics';
import ResultAwareChart from 'in-components/Chart/ResultAwareChart';
import { sloPreviewMetrics } from 'in-service-levels/metrics';
import renderer from 'in-components/Chart/renderer/Renderer';
import { MetricDataPoint } from 'in-components/Chart/types';
import { parseDateTime } from 'in-services/formatters/date';
import { number } from 'in-services/formatters/number';
import useTimeConfig from 'in-hooks/useTimeConfig';

import locals from './SloConfigPreview.mless';

export default function SloConfigPreview() {
  const { form } = useContext(SloFormContext);
  const timeConfig = useTimeConfig();

  const granularity = calculateSloGranularity(timeConfig);

  const target = form.getIn(['objective', 'target']).value;
  const timeWindowType = form.getIn(['objective', 'type']).value;
  const sloEntityType = form.getIn(['entity', 'type']).value;
  const indicatorType = form.getIn(['indicator', 'type']).value;
  const objectiveDate = form.getIn(['objective', 'startTimestamp', 'date']).value;
  const objectiveTime = form.getIn(['objective', 'startTimestamp', 'time']).value;
  const objectiveDurationUnit = form.getIn(['objective', 'durationUnit']).value;
  const objectiveDuration = form.getIn(['objective', 'duration']).value;

  const [metricResult, status, errors, progress] = useSloPreviewMetrics(form);

  const totalBudgetNumber = metricResult?.find(metric => metric.id === 'totalBudget');
  const errorBudgetRemaining = metricResult?.find(metric => metric.id === 'errorBudgetRemaining');
  const remainingBudgetNumber = metricResult?.find(metric => metric.id === 'remainingBudget');
  const statusMetric = metricResult?.find(metric => metric.id === 'statusMetric');

  const fromTimestamp = parseDateTime(`${objectiveDate} ${objectiveTime}`).getTime();

  return (
    <Card leftHeaderContent={<PreviewChartLeftHeader status={status} />}>
      <HorizontalIndicator progress={progress} />
      <SloChartSummary
        remainingBudget={totalBudgetNumber?.values as MetricDataPoint[]}
        totalBudget={remainingBudgetNumber?.values as MetricDataPoint[]}
        fromTimestamp={fromTimestamp}
        indicatorType={indicatorType}
        objectiveDuration={objectiveDuration}
        objectiveDurationUnit={objectiveDurationUnit}
        sloEntityType={sloEntityType}
        status={status}
        sloStatus={statusMetric?.values as MetricDataPoint[]}
        target={target}
        timeWindowType={timeWindowType}
      />
      <div className={locals.chartWrapper}>
        <ResultAwareChart
          config={{
            customHeight: 250,
            granularity: errorBudgetRemaining?.granularity ?? granularity,
            nonInteractive: true,
            y1: {
              metricIds: ['errorBudgetRemaining'],
              metrics: [errorBudgetRemaining?.values as MetricDataPoint[]],
              labels: [sloPreviewMetrics.remainingBudget.label],
              colors: [themes.default.ids.color.option.blue['400']],
              formatter: number.compact,
              renderer: renderer.line
            },
            timeConfig: applyAdjustedTimeframe(timeConfig, metricResult?.[0]?.adjustedTimeframe)
          }}
          result={{ progress, errors }}
        />
      </div>
    </Card>
  );
}
