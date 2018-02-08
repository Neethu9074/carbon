import RoEmitter from 'roemitter';
import { assign } from 'lodash';

import { getBlockSizeMillis, getPredefinedBlockSizeMillisForBlockSize } from 'in-services/util/dynamicAggregation';
import {
  allowedMultiplesOfRollupSizeMissingInCharts,
  allowedMillisGapsInOneSecondResolution
} from 'in-services/featureFlags';
import { getDefaultMetricRollupDuration } from 'in-stores/metric';
import Renderer from 'in-components/Chart/renderer/Renderer';
import { updateCanvasDimensions } from 'in-charts/canvas';
import { number } from 'in-services/formatters/number';
import Scales from 'in-components/Chart/Scales';
import theme from 'in-themes';

const MAX_FPS = 15;

export default class Config {
  constructor(canvas, renderCallback) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.signals = new RoEmitter();

    this.renderingSubscription = this.signals
      .on('render')
      .debounce(1000 / MAX_FPS)
      .subscribe(renderCallback);
  }

  requestRender() {
    this.signals.emit('render', true);
  }

  update(props) {
    assign(this, props);
    this.enrichConfig();

    if (!this.scales) {
      this.scales = new Scales(this);
    }
    this.scales.update();

    updateCanvasDimensions(this.canvas, this.ctx, this.width, this.height, this.devicePixelRatio);
  }

  calculateMaxMillisBetweenDatapoints() {
    if (this.rollup === 1000) {
      return allowedMillisGapsInOneSecondResolution;
    }
    return this.rollup * allowedMultiplesOfRollupSizeMissingInCharts;
  }

  enrichConfig() {
    const { rollup, label } = getDefaultMetricRollupDuration(this.timeframe, this.minRollup);
    this.rollup = rollup || 1000;
    this.rollupLabel = label;

    this.maxDistanceBetweenDatapointsInMillis = this.calculateMaxMillisBetweenDatapoints();

    this.enrichAxis(this.y1);
    this.enrichAxis(this.y2);

    this.determineSeriesColors();

    this.allDomainValues = null;
  }

  enrichAxis(axis) {
    if (!axis) {
      return;
    }
    axis.formatter = axis.formatter || number;
    axis.numOfSeries = axis.labels ? axis.labels.length : 0;
    axis.renderer = axis.renderer || Renderer.line;

    if (axis.renderer.enrich) {
      axis.renderer.enrich(this, axis);
    }
  }

  addBlockSizeMillisForAxis(axis) {
    if (!axis.aggregation) {
      return;
    }
    axis.dynamicCalculatedBlockSizeMillis = getPredefinedBlockSizeMillisForBlockSize(
      getBlockSizeMillis({
        windowSize: this.timeframe.windowSize,
        maxDataPoints: axis.maxDataPoints,
        minPixelPerBlock: axis.minPixelPerBlock,
        width: this.width,
        rollup: this.rollup
      })
    );
  }

  determineSeriesColors() {
    if (!this.y1.colors) {
      this.enrichAxisWithColors(this.y1);
    }

    if (this.y2 && !this.y2.colors) {
      this.enrichAxisWithColors(this.y2, this.y1.numOfSeries);
    }
  }

  enrichAxisWithColors(axis, offset = 0) {
    const colors = theme.chart.strokeColors;
    axis.colors = [];
    for (let i = 0; i < axis.numOfSeries; i++) {
      axis.colors[i] = colors[(i + offset) % colors.length];
    }
  }

  clearTopOverdraw() {
    this.ctx.clearRect(0, 0, this.width, this.scales.y1.getRangeTo());
  }

  clearBottomOverdraw() {
    this.ctx.clearRect(0, this.scales.y1.getRangeFrom(), this.width, this.height);
  }

  clearLeftOverdraw() {
    this.ctx.clearRect(0, 0, this.scales.x.getRangeFrom(), this.height);
  }

  clearRightOverdraw() {
    this.ctx.clearRect(this.scales.x.getRangeTo(), 0, this.width, this.height);
  }

  getAllDomainValues() {
    if (!this.allDomainValues) {
      this.collectAllDomainValues();
    }
    return this.allDomainValues;
  }

  collectAllDomainValues() {
    this.allDomainValues = {};
    this.collectAllDomainValuesForAxis(this.y1);
    this.collectAllDomainValuesForAxis(this.y2);
    this.allDomainValues = Object.keys(this.allDomainValues).map(n => Number(n));
  }

  collectAllDomainValuesForAxis(axis) {
    if (!axis) {
      return;
    }

    for (let iM = 0; iM < axis.metrics.length; iM++) {
      const dataSeries = axis.metrics[iM];
      for (let i = 0; i < dataSeries.length; i++) {
        this.allDomainValues[dataSeries[i][0]] = true;
      }
    }
  }

  calculateBlocks(dataSeries) {
    const blocks = [];
    if (dataSeries.length === 0) {
      return blocks;
    }

    let currentBlock = [];
    blocks.push(currentBlock);

    for (let i = 0; i < dataSeries.length; i++) {
      const dataPoint = dataSeries[i];
      currentBlock.push(dataPoint);

      const nextDataPoint = i + 1 < dataSeries.length ? dataSeries[i + 1] : dataPoint;
      const isEndOfBlock = nextDataPoint[0] - dataPoint[0] > this.maxDistanceBetweenDatapointsInMillis;
      if (isEndOfBlock) {
        currentBlock = [];
        blocks.push(currentBlock);
      }
    }

    return blocks;
  }

  dispose() {
    this.renderingSubscription.dispose();
    this.renderingSubscription = null;
  }
}
