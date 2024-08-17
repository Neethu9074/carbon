/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { get } from 'lodash';

import getTickPositions, { getTickStrategyByFormatter, mapTickPositions } from 'in-services/ticks/vertical';
import { Axis, MetricDataSeries } from 'in-components/Chart/types';
import Configuration from 'in-components/Chart/Configuration';
import createScale, { ScaleType } from 'in-services/scale';

export default class Scales {
  config: Configuration;
  filteredDataSeries: Set<string>;

  y1: ScaleType;
  y2?: ScaleType;

  constructor(config: Configuration, filteredDataSeries: Set<string>) {
    this.config = config;
    this.filteredDataSeries = filteredDataSeries || new Map();

    this.y1 = createScale();
    if (config.y2) {
      this.y2 = createScale();
    }
  }

  update() {
    calculateAxisMinMax('y1', this.config.y1, this.filteredDataSeries);
    calculateAxisMinMax('y2', this.config.y2, this.filteredDataSeries);

    increaseMaxValueForHumanReadability(this.config.y1);
    increaseMaxValueForHumanReadability(this.config.y2);

    if (this.config.shareMaxAxisDomain && this.config.y2) {
      const maxValueOfBothAxis = Math.max(this.config.y1!.maxValue, this.config.y2.maxValue);
      this.config.y1!.maxValue = maxValueOfBothAxis;
      this.config.y2.maxValue = maxValueOfBothAxis;
    }

    this.updateAxisScale(this.config.y1, this.y1);
    // Chart is updated and receives a second axis. Lazily create the scale for this axis.
    if (this.config.y2 && !this.y2) {
      this.y2 = createScale();
    }
    this.updateAxisScale(this.config.y2, this.y2);
  }

  updateAxisScale(axis: Axis | undefined, scale?: ScaleType) {
    if (!axis || !scale) {
      return;
    }
    scale.setRangeTo(this.config.markerPaneHeight);
    scale.setRangeFrom(this.config.height! - this.config.timeAxisHeight);

    scale.setDomainFrom(axis.minValue);
    scale.setDomainTo(axis.maxValue);

    if (axis.fixedTickPositions) {
      scale.tickPositions = mapTickPositions(axis.fixedTickPositions, scale);
    } else {
      scale.tickPositions = getTickPositions({ scale, formatter: axis.formatter[0].detailed, numIntermediateSteps: 3 });
    }
  }
}

export function calculateAxisMinMax(axisName: string, axis: Axis | undefined, filteredDataSeries: Set<string>): void {
  if (!axis) {
    return;
  }
  axis.minValue = axis.min ?? 0;
  if (axis.max != null) {
    // @ts-expect-error The return value seems to not be used anywhere, so the function return type really should be void. However, it seems safer to avoid breaking things by not refactoring this
    return (axis.maxValue = axis.max);
  }

  const metrics = axis.metrics || [];
  const maxValue = (
    axis.valuesDependOnEachOther ? calculateMaxValueForStackedMetrics : calculateMaxValueIndependetMetrics
  )(axisName, axis, metrics, filteredDataSeries);

  if (axis.getMax != null) {
    // @ts-expect-error The return value seems to not be used anywhere, so the function return type really should be void. However, it seems safer to avoid breaking things by not refactoring this
    return (axis.maxValue = axis.getMax(maxValue));
  }

  if (maxValue === 0) {
    // @ts-expect-error The return value seems to not be used anywhere, so the function return type really should be void. However, it seems safer to avoid breaking things by not refactoring this
    return (axis.maxValue = 1);
  }

  axis.maxValue = maxValue;
}

function increaseMaxValueForHumanReadability(axis?: Axis): void {
  if (!axis) {
    return;
  }

  const strategy = getTickStrategyByFormatter(get(axis, ['formatter', 0, 'detailed']));
  axis.maxValue = strategy.roundMaxValueToNextHighestHumanFriendlyValue(axis.maxValue);
}

function calculateMaxValueForStackedMetrics(
  axisName: string,
  axis: Axis,
  metrics: MetricDataSeries[],
  filteredDataSeries: Set<string>
): number {
  const metricMapByTimestamp = new Map();
  for (let iMetric = 0; iMetric < metrics.length; iMetric++) {
    const isIgnoredIndex = filteredDataSeries.has(`${axisName}-${iMetric}`);
    if (isIgnoredIndex) {
      continue;
    }

    const series = metrics[iMetric];
    for (let i = 0; i < series.length; i++) {
      const dataPoint = series[i];
      if (!dataPoint) {
        continue;
      }

      const timestamp = dataPoint[0];
      const value = dataPoint[1];
      if (metricMapByTimestamp.has(timestamp)) {
        const valueInMap = metricMapByTimestamp.get(timestamp);
        if (axis.calculateStackDifferences) {
          metricMapByTimestamp.set(timestamp, Math.max(valueInMap, value));
        } else if (axis.valuesNeedToBeStacked) {
          metricMapByTimestamp.set(timestamp, valueInMap + value);
        } else {
          metricMapByTimestamp.set(timestamp, Math.max(valueInMap, value));
        }
      } else {
        metricMapByTimestamp.set(timestamp, value);
      }
    }
  }

  let maxValue = 0;
  const timestamps = metricMapByTimestamp.keys();
  for (const timestamp of timestamps) {
    maxValue = Math.max(maxValue, metricMapByTimestamp.get(timestamp));
  }

  return maxValue;
}

function calculateMaxValueIndependetMetrics(
  axisName: string,
  _axis: Axis,
  metrics: MetricDataSeries[],
  filteredDataSeries: Set<string>
): number {
  if (metrics.length === 0) {
    return 1;
  }

  const maxValues = metrics.map((metric, i) =>
    filteredDataSeries.has(`${axisName}-${i}`) ? 0 : getMinMaxValueForDataSeries(metric).maxValue
  );

  return Math.max(...maxValues);
}

interface MinMax {
  minValue: number;
  maxValue: number;
}

function getMinMaxValueForDataSeries(dataSeries: MetricDataSeries): MinMax {
  const values = dataSeries.map(dataPoint => dataPoint[1]);
  const minValue = values.length > 0 ? Math.min(...values) : 0;
  const maxValue = values.length > 0 ? Math.max(...values) : 1;

  return { minValue, maxValue };
}
