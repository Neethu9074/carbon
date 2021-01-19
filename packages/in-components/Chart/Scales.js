/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { get } from 'lodash';

import { getTickStrategyByFormatter } from 'in-services/ticks/vertical';
import getTickPositions from 'in-services/ticks/vertical';
import createScale from 'in-services/scale';

export default class Scales {
  constructor(config, filteredDataSeries) {
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
      const maxValueOfBothAxis = Math.max(this.config.y1.maxValue, this.config.y2.maxValue);
      this.config.y1.maxValue = maxValueOfBothAxis;
      this.config.y2.maxValue = maxValueOfBothAxis;
    }

    this.updateAxisScale(this.config.y1, this.y1);
    // Chart is updated and receives a second axis. Lazily create the scale for this axis.
    if (this.config.y2 && !this.y2) {
      this.y2 = createScale();
    }
    this.updateAxisScale(this.config.y2, this.y2);
  }

  updateAxisScale(axis, scale) {
    if (!axis) {
      return;
    }

    scale.setRangeTo(this.config.markerPaneHeight);
    scale.setRangeFrom(this.config.height - this.config.timeAxisHeight);

    scale.setDomainFrom(axis.minValue);
    scale.setDomainTo(axis.maxValue);

    scale.tickPositions = getTickPositions(scale, axis.formatter[0].detailed, 3);
  }
}

export function calculateAxisMinMax(axisName, axis, filteredDataSeries) {
  if (!axis) {
    return;
  }

  axis.minValue = axis.min ?? 0;
  if (axis.max != null) {
    return (axis.maxValue = axis.max);
  }

  const metrics = axis.metrics || [];
  const maxValue = (axis.valuesDependOnEachOther
    ? calculateMaxValueForStackedMetrics
    : calculateMaxValueIndependetMetrics)(axisName, axis, metrics, filteredDataSeries);

  if (axis.getMax != null) {
    return (axis.maxValue = axis.getMax(maxValue));
  }

  if (maxValue === 0) {
    return (axis.maxValue = 1);
  }

  axis.maxValue = maxValue;
}

function increaseMaxValueForHumanReadability(axis) {
  if (!axis) {
    return;
  }
  const strategy = getTickStrategyByFormatter(get(axis, ['formatter', 0, 'detailed']));
  axis.maxValue = strategy.roundMaxValueToNextHighestHumanFriendlyValue(axis.maxValue);
}

function calculateMaxValueForStackedMetrics(axisName, axis, metrics, filteredDataSeries) {
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

function calculateMaxValueIndependetMetrics(axisName, axis, metrics, filteredDataSeries) {
  let maxValue = 0;
  for (let iMetric = 0; iMetric < metrics.length; iMetric++) {
    const isIgnoredIndex = filteredDataSeries.has(`${axisName}-${iMetric}`);
    if (isIgnoredIndex) {
      continue;
    }

    const minMax = getMinMaxValueForDataSeries(metrics[iMetric]);
    maxValue = Math.max(maxValue, minMax.maxValue);
  }
  return maxValue;
}

function getMinMaxValueForDataSeries(dataSeries) {
  let minValue = Number.MAX_VALUE;
  let maxValue = 0;
  for (let i = 0; i < dataSeries.length; i++) {
    const dataPoint = dataSeries[i];
    if (dataPoint) {
      maxValue = Math.max(maxValue, dataPoint[1]);
      minValue = Math.min(minValue, dataPoint[1]);
    }
  }
  return { minValue, maxValue };
}
