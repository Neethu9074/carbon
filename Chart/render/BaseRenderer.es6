'use strict';

import d3 from 'd3';

import {theme} from 'instana-ui-services/theme';

import Queue from '../Queue';
import Data from '../Data';

const minReducer = (min, dataRow) => Math.Min(dataRow.y, min);
const maxReducer = (max, dataRow) => Math.Max(dataRow.y, max);

export default class BaseRenderer {

  constructor({seriesConfig, container, width, height, windowSize}) {
    this.width = width;
    this.height = height;
    this.seriesConfig = seriesConfig;
    this.container = container;

    this.x = d3.time.scale.utc();
    this.y = d3.scale.linear();
    this.queue = new Queue(this.seriesConfig.length);
    this.data = new Data({windowSize});
    this.createCanvas();

    this.setDimensions({width, height});
  }

  getSeriesColor(seriesIndex) {
    return theme.chart.strokeColors[seriesIndex];
  }

  createCanvas() {
    this.container.classList.add('in-chart');

    // The render canvas is the user visible paint area that is only populated
    // by this base class. All other classes draw onto the drawingCanvas.
    this.renderCanvas = document.createElement('canvas');
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
    return this.width * 2;
  }

  addDataPoint(seriesIndex, dataPoint) {
    this.queue.addDataPoint(seriesIndex, dataPoint);
  }

  start() {
    // this.clearDrawingCanvas();

    const newDataColumns = this.queue.get();
    this.processNewDataColumns(newDataColumns);
    this.data.addDataColumns(newDataColumns);
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
    // TODO do initial render
    // TODO start animation
  }

  processNewDataColumns() {
    // noop, but could be overriden to apply stacking and other modifications
  }

  updateXDomain() {
    const dataColumns = this.data.getDataColumns();
    const numberOfDataColumns = dataColumns.length;

    let minX = dataColumns[0][0].x;
    let maxX = dataColumns[numberOfDataColumns - 1][0].x;

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
    this.width = width;
    this.height = height;

    this.renderCanvas.setAttribute('width', this.width);
    this.renderCanvas.setAttribute('height', this.height);

    this.drawingCanvas.setAttribute('width', this.getDrawingCanvasWidth());
    this.drawingCanvas.setAttribute('height', this.height);

    this.x.range([0, this.width]);
    this.y.range([this.height, 0]);
  }

  dispose() {
    this.container.removeChild(this.renderCanvas);
    // TODO stop animation
    // remove all created HTML elements
  }

  clearDrawingCanvas() {
    this.drawingCtx.clearRect(0, 0, this.getDrawingCanvasWidth(), this.height);
  }
}
