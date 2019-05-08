import { getAxisTickPositions } from 'in-charts/ticks/timeAxis';
import { getAxisConfig } from 'in-charts/timeFormatting';
import createScale from 'in-charts/scale';

export default class Scales {
  constructor(config, filteredDataSeries) {
    this.config = config;
    this.filteredDataSeries = filteredDataSeries || new Map();

    this.xBackBuffer = createScale();
    this.xBackBuffer.setRangeFrom(0);

    this.y1 = createScale();
    if (config.y2) {
      this.y2 = createScale();
    }
  }

  update() {
    this.xBackBuffer.setRangeTo(this.config.backBufferWidth);

    this.xBackBuffer.tickPositions = this.calculateTickPositionsForXAxis();

    calculateAxisMinMax(this.config.y1, this.filteredDataSeries);
    calculateAxisMinMax(this.config.y2, this.filteredDataSeries);

    if (this.config.shareMaxAxisDomain && this.config.y2) {
      const maxValueOfBothAxis = Math.max(this.config.y1.maxValue, this.config.y2.maxValue);
      this.config.y1.maxValue = maxValueOfBothAxis;
      this.config.y2.maxValue = maxValueOfBothAxis;
    }

    this.updateAxisScale(this.config.y1, this.y1);
    this.updateAxisScale(this.config.y2, this.y2);
  }

  updateAxisScale(axis, scale) {
    if (!axis) {
      return;
    }

    scale.setRangeTo(0);
    scale.setRangeFrom(this.config.height - this.config.timeAxisHeight);

    scale.setDomainFrom(axis.minValue);
    scale.setDomainTo(axis.maxValue);

    scale.tickPositions = getAxisTickPositions(scale, axis.formatter[0].detailed);
  }

  calculateTickPositionsForXAxis() {
    const timeConfig = this.config.timeConfig;
    const formatting = getAxisConfig(timeConfig.windowSize);
    const ticks = [];
    const width = this.config.frontBufferWidth;

    let previousTickRange = Number.NEGATIVE_INFINITY;
    let lastTickDomain = formatting.ceilToNearestStep(timeConfig.to - timeConfig.windowSize);
    let lastTickRange = this.xBackBuffer.getRange(lastTickDomain);

    while (lastTickRange <= width) {
      if (previousTickRange + formatting.expectLabelWidth < lastTickRange) {
        ticks.push({
          range: lastTickRange,
          domain: lastTickDomain
        });
        previousTickRange = lastTickRange;
      }

      lastTickDomain += formatting.stepSize;
      lastTickRange = this.xBackBuffer.getRange(lastTickDomain);
    }

    return ticks;
  }
}

export function calculateAxisMinMax(axis, filteredDataSeries) {
  if (!axis) {
    return;
  }

  axis.minValue = 0;
  axis.allDataSeriesIgnored = filteredDataSeries.size === axis.labels.length;
  if (axis.max != null) {
    return (axis.maxValue = axis.max);
  }

  const metrics = axis.metrics || [];
  const maxValue = (axis.valuesNeedToBeStacked
    ? calculateMaxValueForStackedMetrics
    : calculateMaxValueIndependetMetrics)(axis, metrics, filteredDataSeries);

  if (maxValue === 0) {
    return (axis.maxValue = 1);
  }

  axis.maxValue = maxValue;
}

function calculateMaxValueForStackedMetrics(axis, metrics, filteredDataSeries) {
  let maxValue = 0;
  for (let iMetric = 0; iMetric < metrics.length; iMetric++) {
    const isIgnoredIndex = filteredDataSeries.has(axis.labels[iMetric]);
    if (isIgnoredIndex) {
      continue;
    }

    const minMax = getMinMaxValueForDataSeries(metrics[iMetric]);
    maxValue = Math.max(maxValue, minMax.maxValue);
  }
  return maxValue;
}

function calculateMaxValueIndependetMetrics(axis, metrics, filteredDataSeries) {
  let maxValue = 0;
  for (let iMetric = 0; iMetric < metrics.length; iMetric++) {
    const isIgnoredIndex = filteredDataSeries.has(axis.labels[iMetric]);
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
    maxValue = Math.max(maxValue, dataPoint[1]);
    minValue = Math.min(minValue, dataPoint[1]);
  }
  return { minValue, maxValue };
}
