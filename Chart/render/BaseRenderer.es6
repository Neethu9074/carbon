'use strict';

import Queue from '../Queue';

export default class BaseRenderer {

  constructor({seriesConfig, container, width, height}) {
    this.width = width;
    this.height = height;
    this.seriesConfig = seriesConfig;
    this.container = container;

    this.queue = new Queue(this.seriesConfig.length);
    this.createCanvas();
  }

  createCanvas() {
    this.container.classList.add('in-chart');

    // The render canvas is the user visible paint area that is only populated
    // by this base class. All other classes draw onto the drawingCanvas.
    this.renderCanvas = document.createElement('canvas');
    this.renderCanvas.setAttribute('width', this.width);
    this.renderCanvas.setAttribute('height', this.height);
    this.renderCtx = this.canvas.getContext('2d');
    this.container.appendChild(this.renderCanvas);

    // Subsclasses will draw the complete chart without any notion of an
    // animation to the drawingCanvas. This base class will pick up
    // image information in this drawingCanvas and apply it to the renderCanvas.
    this.drawingCanvas = document.createElement('canvas');
    this.drawingCanvas.setAttribute('width', this.width * 2);
    this.drawingCanvas.setAttribute('height', this.height);
    this.drawingCtx = this.canvas.getContext('2d');
  }

  addDataPoint(seriesIndex, dataPoint) {
    this.queue.addDataPoint(seriesIndex, dataPoint);
  }

  start() {
    // TODO do initial render
    // TODO start animation
  }

  onResize({width, height}) {
    this.renderCanvas.setAttribute('width', width);
    this.renderCanvas.setAttribute('height', height);

    // TODO initiate a full redraw?
  }

  dispose() {
    this.container.removeChild(this.renderCanvas);
    // TODO stop animation
    // remove all created HTML elements
  }
}
