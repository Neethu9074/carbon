import { create } from 'reactive-observables';
import { assign } from 'lodash';

import {
  allowedMultiplesOfRollupSizeMissingInCharts,
  allowedMillisGapsInOneSecondResolution
} from 'in-services/featureFlags';
import { getBlockSizeMillis, getPredefinedBlockSizeMillisForBlockSize } from 'in-services/util/dynamicAggregation';
import { formatDurationAccurately } from 'in-services/formatters/date';
import { getDefaultMetricRollupDuration } from 'in-stores/metric';
import { createCanvas } from 'in-components/Chart/canvasHelper';
import Renderer from 'in-components/Chart/renderer/Renderer';
import { updateCanvasDimensions } from 'in-charts/canvas';
import { number } from 'in-services/formatters/number';
import Scales from 'in-components/Chart/Scales';
import theme from 'in-themes';

export const animationDuration = 2000;
export const wiggleRoom = 5000;

export default class Config {
  constructor(frontBufferCanvas, props) {
    this.timeAxisHeight = 30;
    this.frontBufferCanvas = frontBufferCanvas;
    this.frontBufferCtx = this.frontBufferCanvas.getContext('2d');

    this.backBufferCanvas = createCanvas();
    this.backBufferCtx = this.backBufferCanvas.getContext('2d');

    this.filteredDataSeries$ = create();
    this.filteredDataSeries = new Map();
    this.initDefaultDisabledMetrics(props);
    this.filteredDataSeries$.emit(this.filteredDataSeries);

    this.update(props);
  }

  initDefaultDisabledMetrics(props) {
    this.initDefaultDisabledMetricsForAxis(props.y1);
    if (props.y2) {
      this.initDefaultDisabledMetricsForAxis(props.y2);
    }
  }

  initDefaultDisabledMetricsForAxis(axis) {
    if (axis.defaultDisabledMetrics) {
      for (let mId = 0; mId < axis.metricIds.length; mId++) {
        if (axis.defaultDisabledMetrics.indexOf(axis.metricIds[mId]) >= 0) {
          this.filteredDataSeries.set(axis.labels[mId], true);
        }
      }
    }
  }

  update(props) {
    let shouldResize = false;
    if (this.frontBufferWidth !== props.width || this.height !== props.height) {
      shouldResize = true;
    }

    assign(this, props);
    this.enrichConfig();

    if (!this.scales) {
      this.scales = new Scales(this, this.filteredDataSeries);
    }
    this.scales.update();

    updateCanvasDimensions(
      this.backBufferCanvas,
      this.backBufferCtx,
      this.backBufferWidth,
      this.height,
      this.devicePixelRatio
    );

    if (shouldResize) {
      updateCanvasDimensions(
        this.frontBufferCanvas,
        this.frontBufferCtx,
        this.frontBufferWidth,
        this.height,
        this.devicePixelRatio
      );
    }
  }

  calculateMaxMillisBetweenDatapoints() {
    if (this.rollup === 1000) {
      return allowedMillisGapsInOneSecondResolution;
    }
    return this.rollup * allowedMultiplesOfRollupSizeMissingInCharts;
  }

  enrichConfig() {
    const fullDomain = this.timeConfig.windowSize;

    // we need to round the pixels to full values because some browser APIs cannot handle floats here.
    // because rounding manipulates the calculation we need to add the error created by the rounding to the animation time
    // to avoid chart hoppings
    const bufferOffsetInPx = this.width * (animationDuration / fullDomain);
    const bufferOffsetInPxRounded = Math.ceil(this.width * (animationDuration / fullDomain));
    const differenceInPx = bufferOffsetInPxRounded - bufferOffsetInPx || 0;
    const differenceInTime = (fullDomain / this.width) * differenceInPx || 0;

    this.animationDuration = animationDuration + differenceInTime;

    this.bufferOffsetInPx = bufferOffsetInPxRounded;

    this.frontBufferWidth = this.width;
    this.backBufferWidth = this.width + this.bufferOffsetInPx;
    delete this.width;

    if (this.granularity) {
      this.rollup = this.granularity;
      this.rollupLabel = formatDurationAccurately(this.rollup, 100);
    } else {
      const { rollup, label } = getDefaultMetricRollupDuration(this.timeConfig);
      this.rollup = rollup || 1000;
      this.rollupLabel = label;
    }

    // Hard real time is hard. We are always 2-3 seconds behing the current server time in terms
    // of availability of metrics. We are removing x millis from the right border in order to
    // hide this fact from the user.
    this.wiggleRoom = this.wiggleRoom || wiggleRoom;

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

    axis.numOfSeries = axis.labels ? axis.labels.length : 0;
    axis.formatter = this.getFormatterForAxis(axis);
    axis.renderer = axis.renderer || Renderer.line;

    if (axis.renderer.enrich) {
      axis.renderer.enrich(this, axis);
    }
  }

  getFormatterForAxis(axis) {
    if (axis.numOfSeries === 0) {
      return [number];
    } else if (Array.isArray(axis.formatter)) {
      return axis.formatter;
    }
    const formatter = [];
    for (let i = 0; i < axis.numOfSeries; i++) {
      const f = axis.formatter || number;
      formatter.push({
        compact: f.compact ? f.compact : f,
        detailed: f.detailed ? f.detailed : f
      });
    }
    return formatter;
  }

  addBlockSizeMillisForAxis(axis) {
    if (!axis.aggregation) {
      return;
    }
    axis.dynamicCalculatedBlockSizeMillis =
      this.granularity ||
      getPredefinedBlockSizeMillisForBlockSize(
        getBlockSizeMillis({
          windowSize: this.timeConfig.windowSize,
          maxDataPoints: axis.maxDataPoints,
          minPixelsPerBlock: axis.minPixelsPerBlock || 1,
          width: this.frontBufferWidth,
          rollup: this.rollup
        })
      );
  }

  determineSeriesColors() {
    if (!this.y1.colors) {
      this.enrichAxisWithColors(this.y1);
    }
    this.y1.colors100 = this.getColors100ForColors(this.y1.colors);

    if (this.y2 && !this.y2.colors) {
      this.enrichAxisWithColors(this.y2, this.y1.numOfSeries);
    }
    if (this.y2) {
      this.y2.colors100 = this.getColors100ForColors(this.y2.colors);
    }
  }

  enrichAxisWithColors(axis, offset = 0) {
    const colors = theme.lib.colors.chart.strokeColors25;

    axis.colors = [];
    for (let i = 0; i < axis.numOfSeries; i++) {
      axis.colors[i] = colors[(i + offset) % colors.length];
    }
  }

  getColors100ForColors(colors) {
    return colors.map(color => {
      const colorIndex = theme.lib.colors.chart.strokeColors25.indexOf(color);
      if (colorIndex !== -1) {
        return theme.lib.colors.chart.strokeColors100[colorIndex];
      }
      if (color === theme.lib.colors.chart.self25) {
        return theme.lib.colors.chart.self100;
      }
      return color;
    });
  }

  clearTopOverdraw() {
    this.backBufferCtx.clearRect(0, 0, this.backBufferWidth, this.scales.y1.getRangeTo());
  }

  clearBottomOverdraw() {
    this.backBufferCtx.clearRect(0, this.scales.y1.getRangeFrom(), this.backBufferWidth, this.height);
  }

  clearLeftOverdraw() {
    this.backBufferCtx.clearRect(0, 0, this.scales.xBackBuffer.getRangeFrom(), this.height);
  }

  clearRightOverdraw() {
    this.backBufferCtx.clearRect(this.scales.xBackBuffer.getRangeTo(), 0, this.backBufferWidth, this.height);
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

    return blocks.filter(block => block.length !== 0);
  }

  toggleDataSeries(label) {
    if (this.filteredDataSeries.has(label)) {
      this.filteredDataSeries.delete(label);
    } else {
      this.filteredDataSeries.set(label, true);
    }
    this.filteredDataSeries$.emit(this.filteredDataSeries);
    this.scales.update();
  }
}
