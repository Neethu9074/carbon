import { getAxisTickPositions } from 'in-charts/ticks/timeAxis';
import { getAxisConfig } from 'in-charts/timeFormatting';
import createScale from 'in-charts/scale';

export default class Scales {
  constructor(config, filteredDataSeries) {
    this.config = config;
    this.filteredDataSeries = filteredDataSeries || new Map();
    this.x = createScale();
    this.y1 = createScale();
    if (config.y2) {
      this.y2 = createScale();
    }
  }

  update(filteredDataSeries) {
    this.x.setRangeFrom(0);
    this.x.setRangeTo(this.config.width);
    this.x.setDomainFrom(this.config.timeConfig.to - this.config.timeConfig.windowSize);
    this.x.setDomainTo(this.config.timeConfig.to);
    this.x.tickPositions = this.calculateTickPositionsForXAxis();

    this.updateScale(this.y1, this.config.y1, filteredDataSeries);
    if (this.y2) {
      this.updateScale(this.y2, this.config.y2, filteredDataSeries);
    }
  }

  updateScale(scale, axis) {
    scale.setRangeTo(0);
    scale.setRangeFrom(this.config.height);

    const { minValue, maxValue } = getAxisMinMax(axis, this.filteredDataSeries);
    scale.setDomainFrom(minValue);
    scale.setDomainTo(maxValue);

    scale.tickPositions = getAxisTickPositions(scale, axis.formatter[0].detailed);
  }

  calculateTickPositionsForXAxis() {
    const formatting = getAxisConfig(this.config.timeConfig.windowSize);
    const ticks = [];
    const width = this.x.getRangeTo();

    let previousTickRange = Number.NEGATIVE_INFINITY;
    let lastTickDomain = formatting.ceilToNearestStep(this.x.getDomainFrom());
    let lastTickRange = this.x.getRange(lastTickDomain);

    while (lastTickRange <= width) {
      if (previousTickRange + formatting.expectLabelWidth < lastTickRange) {
        ticks.push({
          range: lastTickRange,
          domain: lastTickDomain
        });
        previousTickRange = lastTickRange;
      }

      lastTickDomain += formatting.stepSize;
      lastTickRange = this.x.getRange(lastTickDomain);
    }

    return ticks;
  }
}

export function getAxisMinMax(axis, filteredDataSeries) {
  let minValue = Number.MAX_VALUE;
  let maxValue = 0;

  const metrics = axis.metrics || [];
  for (let iMetric = 0; iMetric < metrics.length; iMetric++) {
    const isIgnoredIndex = filteredDataSeries.has(axis.labels[iMetric]);
    if (isIgnoredIndex) {
      continue;
    }
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
      // use scale [0, 2*max] to center the data vertically
      minValue = 0;
      maxValue = 2 * maxValue;
    }
  }

  if (axis.min != null) {
    minValue = axis.min;
  }

  if (axis.max != null) {
    maxValue = axis.max;
  }

  return { minValue, maxValue };
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
