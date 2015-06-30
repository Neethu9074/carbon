'use strict';

import d3 from 'd3';
import TWEEN from 'tween.js';

import {theme} from 'instana-ui-services/theme';

import Queue from '../Queue';
import Data from '../Data';

const minReducer = (min, dataRow) => Math.min(dataRow.y, min);
const maxReducer = (max, dataRow) => Math.max(dataRow.y, max);

export default class BaseRenderer {

  constructor(
      {
        seriesConfig,
        container,
        width,
        height,
        windowSize,
        margins,
        yAxisConfig
      }) {
    this.width = width;
    this.height = height;
    this.margins = margins;
    this.seriesConfig = seriesConfig;
    this.container = container;
    this.windowSize = windowSize;
    this.yAxisConfig = yAxisConfig;

    this.x = d3.time.scale.utc();
    this.x.axis = d3.svg.axis()
      .scale(this.x)
      .ticks(5)
      .tickSize(0)
      .tickPadding(20)
      .orient('bottom');

    this.y = d3.scale.linear();
    this.y.axis = d3.svg.axis()
      .scale(this.y)
      .ticks(5)
      .tickPadding(20)
      .tickFormat(this.yAxisConfig.tickFormatter)
      .orient('left');

    this.queue = new Queue(this.seriesConfig.length);
    this.data = new Data({windowSize});
    this.tween = null;

    this.createCanvas();
    this.setDimensions({width, height});

    this.rendering = false;
  }

  getSeriesColor(seriesIndex) {
    return theme.chart.strokeColors[seriesIndex];
  }

  createCanvas() {
    this.container.classList.add('in-chart');
    // hiding the canvas initially to avoid showing broken axes before
    // anything has been painted
    this.container.style.display = 'none';

    // the SVG will be used to position the axis
    this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.svg.classList.add('in-chart__svg');
    this.container.appendChild(this.svg);

    this.x.axis.element = d3.select(this.svg)
      .append('g')
      .attr('class', 'x axis')
      .call(this.x.axis);

    this.y.axis.element = d3.select(this.svg)
      .append('g')
      .attr('class', 'y axis')
      .call(this.y.axis);

    // The render canvas is the user visible paint area that is only populated
    // by this base class. All other classes draw onto the drawingCanvas.
    this.renderCanvas = document.createElement('canvas');
    this.renderCanvas.classList.add('in-chart__canvas');
    this.renderCtx = this.renderCanvas.getContext('2d');
    this.container.appendChild(this.renderCanvas);

    // Subsclasses will draw the complete chart without any notion of an
    // animation to the drawingCanvas. This base class will pick up
    // image information in this drawingCanvas and apply it to the renderCanvas.
    this.drawingCanvas = document.createElement('canvas');
    this.drawingCtx = this.drawingCanvas.getContext('2d');
  }

  /**
   * In order to be able to draw information of canvas, i.e. in the sense of the
   * renderCanvas, the drawingCanvas needs to be larger. Currently only the
   * width needs to be increased.
   *
   * @returns {number} The drawing canvas width
   */
  getDrawingCanvasWidth() {
    return (this.width - this.margins.left - this.margins.right) * 2;
  }

  getRenderCanvasWidth() {
    return this.width - this.margins.left - this.margins.right;
  }

  addDataPoints(seriesIndex, dataPoints) {
    for (let i = 0, len = dataPoints.length; i < len; i++) {
      this.queue.addDataPoint(seriesIndex, dataPoints[i]);
    }
    this.onDataPointAdded();
  }

  addDataPoint(seriesIndex, dataPoint) {
    this.queue.addDataPoint(seriesIndex, dataPoint);
    this.onDataPointAdded();
  }

  onDataPointAdded() {
    if (!this.rendering) {
      this.render(this.queue.get());
    }
  }

  /**
   * Render is called every time the graph's content changes, but not
   * concurrently. This means that animations will finished but a new render
   * cycle is initiated.
   */
  render(newDataColumns) {
    // this value is immediately set to true and will be set back to false
    // by either `renderBigUpdate` or `renderIncrementalUpdate` as both
    // functions' render strategies differ.
    this.rendering = true;
    const initialRendering = this.data.getDataColumns().length === 0;

    // this may happen when there are queued data points, but not actually a
    // sufficient amount to animate the chart.
    if (newDataColumns.length === 0) {
      this.rendering = false;
      return;
    }

    this.processNewDataColumns(newDataColumns);
    this.data.insertSorted(newDataColumns);

    const isBigUpdate = newDataColumns.length > 10 || initialRendering;
    if (isBigUpdate) {
      this.renderBigUpdate();
    } else {
      this.renderIncrementalUpdate();
    }

    // the Chart will be hidden until the first successful paint
    if (initialRendering) {
      this.container.style.display = 'block';
    }
  }

  /**
   * A big update is an update in which a larger number of data points change.
   * This typically happens on the initial render or when the browser tab was
   * inactive. In such cases, it does not make sense to transition a chart.
   *
   * A big update is a bulk update. This means that the chart will be replaced
   * without any animation.
   */
  renderBigUpdate() {
    this.data.expireOldDataColumns();
    this.updateXDomain();
    this.updateYDomain();

    this.drawingCanvas.setAttribute('width', this.getRenderCanvasWidth());
    this.draw();
    this.renderCtx.drawImage(
      this.drawingCanvas,
      0,
      0
    );
    this.x.axis.element.call(this.x.axis);
    this.y.axis.element.call(this.y.axis);

    this.rendering = false;
  }

  /**
   * Incremental updates happen when a small number of data points are added,
   * typically at the back of the data columns. Such an update is animated and
   * will keep the rendering status active (this.rendering === true) until
   * the transition has finished.
   */
  renderIncrementalUpdate() {
    this.updateYDomain();

    const dataColumns = this.data.getDataColumns();
    const numberOfDataColumns = dataColumns.length;
    const maxX = dataColumns[numberOfDataColumns - 1][0].x;
    const maxXPixels = this.x(maxX);
    const renderCanvasWidth = this.getRenderCanvasWidth();
    const animationEndPosition = renderCanvasWidth - maxXPixels;

    this.drawingCanvas.setAttribute('width', renderCanvasWidth + maxXPixels);

    this.draw();

    const onEnd = () => {
      window.cancelAnimationFrame(this.animationFrameHandle);
      this.data.expireOldDataColumns();
      this.updateXDomain();
      this.rendering = false;

      TWEEN.remove(this.tween);

      // If new data has arrived while the previous data was being processed,
      // then we can immediately schedule a new render phase.
      const newDataColumns = this.queue.get();
      if (newDataColumns.length > 0) {
        this.render(newDataColumns);
      }
    };

    this.x.axis.element.attr(
      'transform',
      'translate(' +
        this.margins.left + ',' +
        (this.height - this.margins.bottom) +
      ')'
    );
    this.x.axis.element.call(this.x.axis);
    this.y.axis.element.call(this.y.axis);

    const self = this;

    this.tween = new TWEEN.Tween({x: 0})
      .to({x: animationEndPosition}, 2000)
      // this cannot be an arrow function as tween.js is passing in x values
      // via the execution context
      .onUpdate(function() {
        self.clearRenderingCanvas();
        self.renderCtx.drawImage(
          self.drawingCanvas,
          this.x,
          0
        );
        self.x.axis.element.attr(
          'transform',
          'translate(' +
            (self.margins.left + this.x) + ',' +
            (self.height - self.margins.bottom) +
          ')'
        );
      })
      .onComplete(onEnd)
      .onStop(onEnd)
      .start();

    const animate = (time) => {
      this.animationFrameHandle = requestAnimationFrame(animate);
      this.tween.update(time);
    };
    this.animationFrameHandle = requestAnimationFrame(animate);
  }

  processNewDataColumns() {
    // noop, but could be overriden to apply stacking and other modifications
  }

  updateXDomain() {
    const dataColumns = this.data.getDataColumns();
    const numberOfDataColumns = dataColumns.length;

    let maxX = dataColumns[numberOfDataColumns - 1][0].x;
    let minX = maxX - this.windowSize;

    this.x.domain([minX, maxX]);
  }

  updateYDomain() {
    const minFixed = this.yAxisConfig.min !== undefined;
    const maxFixed = this.yAxisConfig.max !== undefined;
    if (minFixed && maxFixed) {
      this.y.domain([this.yAxisConfig.min, this.yAxisConfig.max]);
      return;
    }
    const dataColumns = this.data.getDataColumns();
    const numberOfDataColumns = dataColumns.length;

    let minY = Number.MAX_VALUE;
    let maxY = Number.MIN_VALUE;

    for (let i = 0; i < numberOfDataColumns; i++) {
      if (!minFixed) {
        minY = Math.min(this.getMinYFromDataColumn(dataColumns[i]), minY);
      }
      if (!maxFixed) {
        maxY = Math.max(this.getMaxYFromDataColumn(dataColumns[i]), maxY);
      }
    }

    if (minFixed) {
      minY = this.yAxisConfig.min;
    }
    if (maxFixed) {
      maxY = this.yAxisConfig.max;
    }
    this.y.domain([minY, maxY]);
  }

  getMinYFromDataColumn(dataColumn) {
    return dataColumn.reduce(minReducer, Number.MAX_VALUE);
  }

  getMaxYFromDataColumn(dataColumn) {
    return dataColumn.reduce(maxReducer, Number.MIN_VALUE);
  }

  onResize({width, height}) {
    this.setDimensions({width, height});
    this.stopAnimations();
    this.rendering = false;

    // initiate a complete redrawn when there data has been processed and
    // painted before
    if (this.data.getDataColumns().length > 0) {
      this.renderBigUpdate();
    }
  }

  setDimensions({width, height}) {
    const horizontalMargin = this.margins.left + this.margins.right;
    const verticalMargin = this.margins.top + this.margins.bottom;

    this.width = width;
    this.height = height;

    this.container.style.width = this.width + 'px';
    this.container.style.height = this.height + 'px';

    this.renderCanvas.style.top = this.margins.top + 'px';
    this.renderCanvas.style.left = this.margins.left + 'px';
    this.renderCanvas.setAttribute('width', this.getRenderCanvasWidth());
    this.renderCanvas.setAttribute('height', this.height - verticalMargin);

    this.drawingCanvas.setAttribute('width', this.getDrawingCanvasWidth());
    this.drawingCanvas.setAttribute('height', this.height - verticalMargin);

    this.svg.setAttribute('width', this.width);
    this.svg.setAttribute('height', this.height);

    this.x.range([0, this.width - horizontalMargin]);
    this.x.axis.element.attr(
      'transform',
      'translate(' +
        this.margins.left + ', ' +
        (this.height - this.margins.bottom) +
      ')'
    );

    this.y.range([this.height - verticalMargin, 0]);
    this.y.axis.tickSize(-1 * this.width + horizontalMargin, 0, 0);
    this.y.axis.element.attr(
      'transform',
      'translate(' +
        this.margins.left + ',' +
        this.margins.top +
      ')'
    );
  }

  dispose() {
    this.container.removeChild(this.renderCanvas);
    this.container.removeChild(this.svg);
    this.stopAnimations();
  }

  stopAnimations() {
    if (this.tween) {
      this.tween.stop();
      TWEEN.remove(this.tween);
    }
    window.cancelAnimationFrame(this.animationFrameHandle);
  }

  clearRenderingCanvas() {
    this.renderCtx.clearRect(
      0,
      0,
      this.width - this.margins.left - this.margins.right,
      this.height - this.margins.top - this.margins.bottom
    );
  }

}
