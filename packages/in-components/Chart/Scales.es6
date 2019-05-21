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

  let minValue = Number.MAX_VALUE;
  let maxValue = 0;

  const metrics = axis.metrics || [];
  let allDataSeriesIgnored = true;
  for (let iMetric = 0; iMetric < metrics.length; iMetric++) {
    const isIgnoredIndex = filteredDataSeries.has(axis.labels[iMetric]);
    if (isIgnoredIndex) {
      continue;
    }
    allDataSeriesIgnored = false;
    const minMax = getMinMaxValueForDataSeries(metrics[iMetric]);

    if (axis.valuesNeedToBeStacked) {
      if (axis.calculateStackDifferences) {
        maxValue += Math.max(0, minMax.maxValue - maxValue);
      } else {
        maxValue += minMax.maxValue;
      }
    } else {
      maxValue = Math.max(maxValue, minMax.maxValue);
    }
    minValue = Math.min(minValue, minMax.minValue);
  }

  if (minValue == Number.MAX_VALUE) {
    // use scale [0, 1] for empty data
    minValue = 0;
    maxValue = 1;
  }

  if (minValue == maxValue) {
    if (maxValue <= 0) {
      maxValue = 1;
    } else {
      minValue = 0;
    }
  }

  if (axis.min != null) {
    minValue = axis.min;
  }

  if (axis.max != null) {
    maxValue = axis.max;
  }

  axis.minValue = 0;
  axis.maxValue = maxValue;
  axis.allDataSeriesIgnored = allDataSeriesIgnored;
  return { minValue, maxValue, allDataSeriesIgnored };
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
