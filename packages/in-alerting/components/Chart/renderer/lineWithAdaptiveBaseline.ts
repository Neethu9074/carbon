/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { ThresholdOperator } from '@instana/types';

import { renderThresholdLineAndBackgrounds } from 'in-alerting/components/Chart/renderer/renderThresholdAndBackgrounds';
// @ts-expect-error modules is not yet migrated to typescript
import line from 'in-components/Chart/renderer/line';
import { updateThresholdPointsIfRequired } from 'in-alerting/components/Chart/renderer/adaptiveBaseline';
import { getAdaptiveBaselineValue } from 'in-alerting/smart-alerts/components/utils/baselineUtils';
import { BaselineDataSeries } from 'in-alerting/components/Chart/renderer/historicBaseline';
import { DataSeries, RenderAxis, RenderConfig } from 'in-components/Chart/renderer/types';
import { isGreaterOperator } from 'in-alerting/smart-alerts/components/utils/alertUtils';
import { AxisColor, MetricDataSeries } from 'in-components/Chart/types';
import { Granularity, TimeConfig } from 'in-types';
import { ScaleType } from 'in-services/scale';

export default {
  render: ({
    colors50,
    colors100,
    scale,
    config,
    metrics
  }: {
    colors50: AxisColor[];
    colors100: AxisColor[];
    scale: ScaleType;
    config: RenderConfig;
    metrics: MetricDataSeries[];
  }): void => {
    const metric = metrics[0];

    renderAdaptiveBaseline(config, scale, colors50, colors100);

    // historical data
    line.render({ dataSeries: metric, color: colors100[0]!, scale, config });
  },
  enrich: (_config: unknown, axis: RenderAxis) => {
    axis.valuesDependOnEachOther = true;
  }
};

export function getThresholdInTimeframe(
  baselineEntriesFromMetadata: DataSeries,
  baseline: BaselineDataSeries,
  sensitivity: number,
  isGreaterOp: boolean,
  granularity: Granularity,
  timeConfig?: TimeConfig
): DataSeries {
  const thresholdInTimeframe: DataSeries = [];
  const eventBasedAdaptiveBaseline = baselineEntriesFromMetadata ?? [];

  // NOTE: We are rendering adaptive baseline for 2 use-cases.
  // 1) In SA Dialogue via fetching the threshold suggestion
  // 2) In event details view using event metadata
  // 3) In Alert Configuration Details
  if (eventBasedAdaptiveBaseline.length === 0 && baseline?.length >= 0) {
    if (timeConfig) {
      const startTime = calculateFirstBucketInChartStartTime(timeConfig, granularity);
      for (let [timestamp, baselineValue, deviationValue] of baseline) {
        if (timestamp >= startTime) {
          const thresholdValue = getAdaptiveBaselineValue(baselineValue, deviationValue, sensitivity, isGreaterOp);
          thresholdInTimeframe.push([timestamp, thresholdValue]);
        }
      }
    } else {
      for (let [timestamp, baselineValue, deviationValue] of baseline) {
        const thresholdValue = getAdaptiveBaselineValue(baselineValue, deviationValue, sensitivity, isGreaterOp);
        thresholdInTimeframe.push([timestamp, thresholdValue]);
      }
    }
  } else {
    for (const [timestamp, thresholdValue] of eventBasedAdaptiveBaseline) {
      thresholdInTimeframe.push([Number(timestamp), thresholdValue]);
    }
  }

  return thresholdInTimeframe;
}

function calculateFirstBucketInChartStartTime(timeConfig: TimeConfig, granularity: Granularity): number {
  const to = timeConfig.to ?? Date.now();
  return to - timeConfig.windowSize - granularity;
}

export interface RenderAxisWithBaseline extends RenderAxis {
  baseline: BaselineDataSeries;
  sensitivity: number;
  operator: ThresholdOperator;
  eventBasedAdaptiveBaseline: DataSeries;
  thresholdGranularity: Granularity;
}

function renderAdaptiveBaseline(
  config: RenderConfig,
  scale: ScaleType,
  colors50: AxisColor[],
  colors100: AxisColor[]
): void {
  const { y1 } = config;
  const {
    baseline,
    sensitivity,
    operator,
    eventBasedAdaptiveBaseline,
    thresholdGranularity
  } = y1 as RenderAxisWithBaseline;

  if ((baseline ?? []).length === 0 && (eventBasedAdaptiveBaseline ?? []).length === 0) {
    return;
  }

  const isGreaterOp = operator === undefined || isGreaterOperator(operator);
  const thresholdInTimeframe: DataSeries = getThresholdInTimeframe(
    eventBasedAdaptiveBaseline,
    baseline,
    sensitivity,
    isGreaterOp,
    thresholdGranularity
  );

  const startTime = calculateFirstBucketInChartStartTime(config.timeConfig, thresholdGranularity);
  const oneSidedThresholdInTimeframe: DataSeries = updateThresholdPointsIfRequired(
    thresholdInTimeframe,
    thresholdGranularity,
    startTime
  );

  const withGaps = true;

  renderThresholdLineAndBackgrounds(
    config,
    scale,
    colors50,
    colors100,
    oneSidedThresholdInTimeframe,
    isGreaterOp,
    withGaps
  );
}
