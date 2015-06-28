'use strict';

import d3 from 'd3';
import TWEEN from 'tween.js';

import {theme} from 'instana-ui-services/theme';

import Queue from '../Queue';
import Data from '../Data';

const minReducer = (min, dataRow) => Math.Min(dataRow.y, min);
const maxReducer = (max, dataRow) => Math.Max(dataRow.y, max);

export default class BaseRenderer {

  constructor({seriesConfig, container, width, height, windowSize, margins}) {
    this.width = width;
    this.height = height;
    this.margins = margins;
    this.seriesConfig = seriesConfig;
    this.container = container;
    this.windowSize = windowSize;

    this.x = d3.time.scale.utc();
    this.y = d3.scale.linear();
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

    // the SVG will be used to position the axis
    this.svg = document.createElement('svg');
    this.svg.classList.add('in-chart__svg');
    this.container.appendChild(this.svg);
  }

  /**
   * In order to be able to draw information of canvas, i.e. in the sense of the
   * renderCanvas, the drawingCanvas needs to be larger. Currently only the
   * width needs to be increased.
   *
   * @returns {number} The drawing canvas width
   */
  getDrawingCanvasWidth() {
    return this.width * 2;
  }

  addDataPoint(seriesIndex, dataPoint) {
    this.queue.addDataPoint(seriesIndex, dataPoint);
  }

  start() {
    this.render(this.queue.get());

    // we use this observable to be informed about incoming data points. These
    // incoming data points will be used to continously update the chart.
    this.queue.dataPointAdded.subscribe(this.onDataPointAdded.bind(this));
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
    // functions render strategies differ.
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
    this.clearDrawingCanvas();
    if (isBigUpdate) {
      this.renderBigUpdate();
    } else {
      this.renderIncrementalUpdate();
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

    this.draw();
    const imageData = this.drawingCtx.getImageData(
      0,
      0,
      this.getDrawingCanvasWidth(),
      this.height
    );
    this.renderCtx.putImageData(
      imageData,
      0,
      0
    );

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

    this.draw();
    const dataColumns = this.data.getDataColumns();
    const numberOfDataColumns = dataColumns.length;
    const maxX = dataColumns[numberOfDataColumns - 1][0].x;
    const animationEndPosition = this.width - this.x(maxX);

    const imageData = this.drawingCtx.getImageData(
      0,
      0,
      this.getDrawingCanvasWidth(),
      this.height
    );

    const onEnd = () => {
      window.cancelAnimationFrame(this.animationFrameHandle);
      this.data.expireOldDataColumns();
      this.updateXDomain();
      this.rendering = false;

      const newDataColumns = this.queue.get();
      if (newDataColumns.length > 0) {
        this.render(newDataColumns);
      }
    };

    const renderCtx = this.renderCtx;
    this.tween = new TWEEN.Tween({x: 0})
      .to({x: animationEndPosition}, 2000)
      // this cannot be an arrow function as tween.js is passing in x values
      // via the execution context
      .onUpdate(function() {
        renderCtx.putImageData(
          imageData,
          this.x,
          0
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
    const dataColumns = this.data.getDataColumns();
    const numberOfDataColumns = dataColumns.length;

    let minY = Number.MAX_VALUE;
    let maxY = Number.MIN_VALUE;

    for (let i = 0; i < numberOfDataColumns; i++) {
      minY = Math.min(this.getMinYFromDataColumn(dataColumns[i]), minY);
      maxY = Math.max(this.getMaxYFromDataColumn(dataColumns[i]), maxY);
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
    // TODO initiate a full redraw?
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
    this.renderCanvas.setAttribute('width', this.width - horizontalMargin);
    this.renderCanvas.setAttribute('height', this.height - verticalMargin);

    this.drawingCanvas.setAttribute('width', this.getDrawingCanvasWidth());
    this.drawingCanvas.setAttribute('height', this.height - verticalMargin);

    this.svg.style.width = this.width + 'px';
    this.svg.style.height = this.height + 'px';

    this.x.range([0, this.width]);
    this.y.range([this.height - verticalMargin, 0]);
  }

  dispose() {
    this.container.removeChild(this.renderCanvas);
    if (this.tween) {
      this.tween.stop();
    }
    window.cancelAnimationFrame(this.animationFrameHandle);
  }

  clearDrawingCanvas() {
    this.drawingCtx.clearRect(0, 0, this.getDrawingCanvasWidth(), this.height);
  }
}
