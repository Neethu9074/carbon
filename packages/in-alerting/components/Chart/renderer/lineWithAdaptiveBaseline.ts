/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { AdaptiveBaselineData, ThresholdOperator } from '@instana/types';

import {
  DataSeries,
  MultiMetricRenderProps,
  RenderAxis,
  RenderConfig,
  Renderer
} from 'in-components/Chart/renderer/types';
import { renderThresholdLineAndBackgrounds } from 'in-alerting/components/Chart/renderer/renderThresholdAndBackgrounds';
import { updateThresholdPointsIfRequired } from 'in-alerting/components/Chart/renderer/adaptiveBaseline';
import { isGreaterOperatorOrUndefined } from 'in-alerting/smart-alerts/components/utils/alertUtils';
import { getAdaptiveBaselineValue } from 'in-alerting/smart-alerts/components/utils/baselineUtils';
import { BaselineDataSeries } from 'in-alerting/components/Chart/renderer/historicBaseline';
import { AxisColor } from 'in-components/Chart/types';
import line from 'in-components/Chart/renderer/line';
import { Granularity, TimeConfig } from 'in-types';
import { ScaleType } from 'in-services/scale';

export const createLineWithAdaptiveBaseline = (
  thresholdOperator: ThresholdOperator,
  threshold: AdaptiveBaselineData,
  thresholdGranularity: Granularity,
  eventBasedAdaptiveBaseline: DataSeries
): Renderer<MultiMetricRenderProps> => {
  return {
    render: ({ colors50, colors100, scale, config, metrics }): void => {
      const metric = metrics[0];

      renderAdaptiveBaseline(
        config,
        scale,
        thresholdOperator,
        threshold,
        eventBasedAdaptiveBaseline,
        thresholdGranularity,
        colors50,
        colors100
      );

      // historical data
      line.render({ dataSeries: metric, color: colors100[0]!, scale, config });
    },
    enrich: (_config: unknown, axis: RenderAxis) => {
      axis.valuesDependOnEachOther = true;
    }
  };
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

function renderAdaptiveBaseline(
  config: RenderConfig,
  scale: ScaleType,
  thresholdOperator: ThresholdOperator,
  baselineData: AdaptiveBaselineData,
  eventBasedAdaptiveBaseline: DataSeries,
  thresholdGranularity: Granularity,
  colors50: AxisColor[],
  colors100: AxisColor[]
): void {
  const { baseline, deviationFactor: sensitivity } = baselineData;

  if ((baseline ?? []).length === 0 && (eventBasedAdaptiveBaseline ?? []).length === 0) {
    return;
  }

  const isGreaterOp = isGreaterOperatorOrUndefined(thresholdOperator);
  const thresholdInTimeframe: DataSeries = getThresholdInTimeframe(
    eventBasedAdaptiveBaseline,
    baseline as BaselineDataSeries, // need casting for number[]-> [number,number,number]
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
