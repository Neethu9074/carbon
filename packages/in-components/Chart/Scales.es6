import { getAxisTickPositions } from 'in-charts/ticks/timeAxis';
import { getAxisConfig } from 'in-charts/timeFormatting';
import createScale from 'in-charts/scale';

// export for tests
export const MARGIN_BOTTOM = 25;
export const MARGIN_TOP = 2;
export const MARGIN_VERTICAL_AXIS = 80;

export default class Scales {
  constructor(config) {
    this.config = config;
    this.x = createScale();
    this.y1 = createScale();
    if (config.y2) {
      this.y2 = createScale();
    }
  }

  update() {
    this.x.setRangeFrom(MARGIN_VERTICAL_AXIS);
    this.x.setRangeTo(this.config.width - MARGIN_VERTICAL_AXIS);
    this.x.setDomainFrom(this.config.timeframe.to - this.config.timeframe.windowSize);
    this.x.setDomainTo(this.config.timeframe.to);
    this.x.tickPositions = this.calculateTickPositionsForXAxis();

    this.updateScale(this.y1, this.config.y1);
    if (this.y2) {
      this.updateScale(this.y2, this.config.y2);
    }
  }

  updateScale(scale, axis) {
    scale.setRangeTo(MARGIN_TOP);
    scale.setRangeFrom(this.config.height - MARGIN_BOTTOM);

    let minValue = Number.MAX_VALUE;
    let maxValue = 0;

    const metrics = axis.metrics || [];
    for (let iMetric = 0; iMetric < metrics.length; iMetric++) {
      const minMax = this.getMinMaxValueForDataSeries(metrics[iMetric]);

      if (axis.valuesNeedToBeStacked) {
        maxValue += minMax.maxValue;
      } else {
        maxValue = Math.max(maxValue, minMax.maxValue);
      }
      minValue = Math.min(minValue, minMax.minValue);
    }

    scale.setDomainFrom(minValue);
    scale.setDomainTo(maxValue);

    scale.tickPositions = getAxisTickPositions(scale, axis.formatter.detailed);
  }

  getMinMaxValueForDataSeries(dataSeries) {
    let minValue = Number.MAX_VALUE;
    let maxValue = 0;
    for (let i = 0; i < dataSeries.length; i++) {
      const dataPoint = dataSeries[i];
      maxValue = Math.max(maxValue, dataPoint[1]);
      minValue = Math.min(minValue, dataPoint[1]);
    }
    return { minValue, maxValue };
  }

  calculateTickPositionsForXAxis() {
    const formatting = getAxisConfig(this.config.timeframe.windowSize);
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
