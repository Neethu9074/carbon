/* eslint complexity:[2, 13] */
import * as ro from 'reactive-observables';
import TWEEN from 'tween.js';
import moment from 'moment';
import _ from 'lodash';
import d3 from 'd3';

import * as timelineStore from 'in-services/stores/timeline';
import {theme} from 'in-services/theme';

import Queue from './Queue';
import Data from './Data';

const block = 'in-chart';

const minReducer = (min, dataRow) => Math.min(dataRow.y, min);
const maxReducer = (max, dataRow) => Math.max(dataRow.y, max);

const desiredFps = 24;
const timeBetweenUpdatesInMillis = 1000 / desiredFps;

export default class Renderer {

  constructor(
      {
        container,
        height,
        windowSize,
        margins,
        y1,
        y2
      }) {
    this.margins = margins;
    this.container = container;
    this.windowSize = windowSize;
    this.tween = null;

    this.x = d3.time.scale();
    this.x.axis = d3.svg.axis()
      .scale(this.x)
      .ticks(5)
      .tickSize(0)
      .tickPadding(20)
      .tickFormat(d3.time.format('%H:%M'))
      .orient('bottom');

    this.y1 = d3.scale.linear();
    this.y1.config = y1;
    this.y1.config.seriesConfig = y1.labels
      .map((label, i) => {
        const series = {};
        series.label = label;
        series.color = theme.chart.strokeColors[i];
        return series;
      });
    this.y1.axis = d3.svg.axis()
      .scale(this.y1)
      .ticks(5)
      .tickSize(1)
      .tickPadding(20)
      // tickFormat function will get two parameters: value and tick index.
      // Our formatter contract is only one parameter, so we need to swallow
      // the index parameter. (Our formatters sometimes use precision as
      // second parameter)
      .tickFormat((v) => this.y1.config.formatter(v))
      .orient('left');
    this.y1.queue = new Queue(this.y1.config.seriesConfig.length);
    this.y1.data = new Data({windowSize});

    if (y2) {
      this.y2 = d3.scale.linear();
      this.y2.config = y2;
      this.y2.config.seriesConfig = y2.labels
        .map((label, i) => {
          const series = {};
          series.label = label;
          series.color = theme.chart.strokeColors[
            i + this.y1.config.seriesConfig.length
          ];
          return series;
        });
      this.y2.axis = d3.svg.axis()
        .scale(this.y2)
        .ticks(5)
        .tickSize(1)
        .tickPadding(20)
        // tickFormat function will get two parameters: value and tick index.
        // Our formatter contract is only one parameter, so we need to swallow
        // the index parameter. (Our formatters sometimes use precision as
        // second parameter)
        .tickFormat((v) => this.y2.config.formatter(v))
        .orient('right');
      this.y2.queue = new Queue(this.y2.config.seriesConfig.length);
      this.y2.data = new Data({windowSize});
    }

    this.createCanvas();
    this.setDimensions({width: container.clientWidth, height: height});

    this.focusedMoment = null;
    this.focusedMomentSubscription = timelineStore.focusedMoment
      .throttle(20)
      .subscribe(focusedMoment => this.onFocusChange(focusedMoment));

    ro.on(this.glassPane, 'mousemove')
      .subscribe(e => {
        timelineStore.setFocusedMoment(this.x.invert(e.offsetX).getTime());
      });

    ro.on(this.glassPane, 'mouseleave')
      .subscribe(timelineStore.clearFocusedMoment);

    ro.on(window, 'resize')
      .debounce(500)
      .subscribe(() => {
        // TODO yak! Improve width calculation after alpha
        this.chartContentContainer.style.display = 'none';
        this.setDimensions({
          width: this.widthCalculationElement.clientWidth, height
        });
        this.chartContentContainer.style.display = 'block';
      });

    this.rendering = false;
  }

  onFocusChange(newFocusedMoment) {
    // only update the visibility when actually necessary
    if (this.focusedMoment && !newFocusedMoment) {
      this.tooltipLine.style('display', 'none');
      this.tooltipElement.style.display = 'none';
    } else if (!this.focusedMoment && newFocusedMoment) {
      this.tooltipLine.style('display', 'block');
      this.tooltipElement.style.display = 'block';
    }

    this.focusedMoment = newFocusedMoment;

    if (newFocusedMoment) {
      const dataY1 = this.lookForDataPoint(this.y1, newFocusedMoment);
      let dataY2;
      if (this.y2) {
        dataY2 = this.lookForDataPoint(this.y2, newFocusedMoment);
      }

      if (dataY1) {
        this.focusedMoment = dataY1[0].x;
        this.focusedY1 = dataY1;
        this.focusedY2 = dataY2;
        this.fillTooltip();
      }
    } else {
      this.focusedMoment = null;
    }
  }

  lookForDataPoint(axis, x) {
    const data = axis.data.getDataColumns();
    const i = _.sortedIndex(
      data,
      x,
      column => {
        if (column[0]) {
          return column[0].x;
        }
        // this iteratee function will be called for the search value as well
        return column;
      }
    );
    return data[i];
  }

  fillTooltip() {
    this.tooltipTime.textContent = moment(this.focusedY1[0].x).calendar();

    const elements = this.tooltipValueElements;

    this.focusedY1.forEach((dataPoint, i) => {
      const f = this.y1.config.tooltipFormatter || this.y1.config.formatter;
      elements[i].textContent = f(dataPoint.y);
    });

    if (this.focusedY2) {
      const offset = this.focusedY1.length;
      const f = this.y2.config.tooltipFormatter || this.y2.config.formatter;
      this.focusedY2.forEach((dataPoint, i) => {
        elements[i + offset].textContent = f(dataPoint.y);
      });
    }
  }

  createCanvas() {
    this.container.classList.add('in-chart');
    // hiding the canvas initially to avoid showing broken axes before
    // anything has been painted
    this.container.style.visibility = 'hidden';

    this.widthCalculationElement = document.createElement('div');
    this.container.appendChild(this.widthCalculationElement);

    // content needs to be treated in a specific way in order to make sure
    // that dimension calculation is functional.
    this.chartContentContainer = document.createElement('div');
    this.chartContentContainer.classList.add('in-chart__content');
    this.container.appendChild(this.chartContentContainer);

    // The render canvas is the user visible paint area that is only populated
    // by this base class. All other classes draw onto the drawingCanvas.
    this.renderCanvas = document.createElement('canvas');
    this.renderCanvas.classList.add('in-chart__canvas');
    this.renderCtx = this.renderCanvas.getContext('2d');
    this.chartContentContainer.appendChild(this.renderCanvas);

    // Subsclasses will draw the complete chart without any notion of an
    // animation to the drawingCanvas. This base class will pick up
    // image information in this drawingCanvas and apply it to the renderCanvas.
    this.drawingCanvas = document.createElement('canvas');
    this.drawingCtx = this.drawingCanvas.getContext('2d');

    // the SVG will be used to position the axis
    this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.svg.classList.add('in-chart__svg');
    this.chartContentContainer.appendChild(this.svg);

    const $svg = d3.select(this.svg);

    this.topLine = $svg.append('line')
      .attr('class', 'top-axis');

    this.bottomLine = $svg.append('line')
      .attr('class', 'bottom-axis');

    this.slidingSection = $svg.append('g');

    this.x.axis.element = this.slidingSection
      .append('g')
      .attr('class', 'x axis')
      .call(this.x.axis);

    this.y1.axis.element = $svg
      .append('g')
      .attr('class', 'y y--1 axis')
      .call(this.y1.axis);

    if (this.y2) {
      this.y2.axis.element = $svg
        .append('g')
        .attr('class', 'y y--1 axis')
        .call(this.y2.axis);
    }

    this.tooltipLine = this.slidingSection
      .append('line')
      .attr('class', 'tooltip-note')
      .style('display', 'none');

    this.createTooltip();

    this.glassPane = document.createElement('div');
    this.glassPane.style.position = 'absolute';
    this.chartContentContainer.appendChild(this.glassPane);
  }

  createTooltip() {
    const tooltip = this.tooltipElement = document.createElement('div');
    tooltip.classList.add(block + '__tooltip');
    tooltip.style.display = 'none';
    this.chartContentContainer.appendChild(tooltip);

    const p = this.tooltipTime = document.createElement('p');
    p.classList.add(block + '__tooltip-time');
    tooltip.appendChild(p);

    const dl = document.createElement('dl');
    dl.classList.add(block + '__tooltip-metrics');
    tooltip.appendChild(dl);

    const valueElements = this.tooltipValueElements = [];
    this.y1.config.seriesConfig.forEach(series => {
      const wrapper = document.createElement('div');
      wrapper.classList.add(block + '__tooltip-metric');
      dl.appendChild(wrapper);

      const label = document.createElement('dt');
      label.classList.add(block + '__tooltip-label');
      label.style.color = series.color;
      label.textContent = series.label;
      wrapper.appendChild(label);

      const value = document.createElement('dd');
      value.classList.add(block + '__tooltip-value');
      wrapper.appendChild(value);
      valueElements.push(value);
    });

    if (this.y2) {
      this.y2.config.seriesConfig.forEach(series => {
        const wrapper = document.createElement('div');
        wrapper.classList.add(block + '__tooltip-metric');
        dl.appendChild(wrapper);

        const label = document.createElement('dt');
        label.classList.add(block + '__tooltip-label');
        label.style.color = series.color;
        label.textContent = series.label;
        wrapper.appendChild(label);

        const value = document.createElement('dd');
        value.classList.add(block + '__tooltip-value');
        wrapper.appendChild(value);
        valueElements.push(value);
      });
    }
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

  addDataPoints(axis, seriesIndex, dataPoints) {
    for (let i = 0, len = dataPoints.length; i < len; i++) {
      this[axis].queue.addDataPoint(seriesIndex, dataPoints[i]);
    }
    this.onDataPointAdded();
  }

  addDataPoint(axis, seriesIndex, dataPoint) {
    this[axis].queue.addDataPoint(seriesIndex, dataPoint);
    this.onDataPointAdded();
  }

  onDataPointAdded() {
    if (!this.rendering) {
      this.render();
    }
  }

  /**
   * Render is called every time the graph's content changes, but not
   * concurrently. This means that animations will finished but a new render
   * cycle is initiated.
   */
  render() {
    // this value is immediately set to true and will be set back to false
    // by either `renderBigUpdate` or `renderIncrementalUpdate` as both
    // functions' render strategies differ.
    this.rendering = true;

    const initialRendering = this.y1.data.getDataColumns().length === 0 ||
      (this.y2 && this.y2.data.getDataColumns().length === 0);

    const newDataColumnsY1 = this.y1.queue.get();
    this.processNewDataColumns('y1', newDataColumnsY1);
    this.y1.data.insertSorted(newDataColumnsY1);

    let newDataColumnsY2;
    if (this.y2) {
      newDataColumnsY2 = this.y2.queue.get();
      this.processNewDataColumns('y2', newDataColumnsY2);
      this.y2.data.insertSorted(newDataColumnsY2);
    }

    // The initial draw should only happen when we have adata points for both
    // axis.
    const dataPointsForY2Available = !this.y2 || this.y2.data.getDataColumns().length > 0;
    if (this.y1.data.getDataColumns().length === 0 || !dataPointsForY2Available) {
      this.rendering = false;
      return;
    }

    if (initialRendering) {
      this.renderBigUpdate();
    } else {
      this.renderIncrementalUpdate();
    }

    this.renderTooltip();

    // the Chart will be hidden until the first successful paint
    if (initialRendering) {
      this.container.style.visibility = 'visible';
    }
  }

  renderTooltip() {
    // no need to render anything when there is no focused moment
    if (!this.focusedMoment) {
      return;
    }

    const x = this.x(this.focusedMoment);
    this.tooltipLine.attr('x1', x).attr('x2', x);

    const availableWidth = this.width - this.margins.left - this.margins.right;
    if (x > (availableWidth / 2)) {
      const tooltipX = availableWidth - x + 50 + this.margins.right;
      this.tooltipElement.style.left = null;
      this.tooltipElement.style.right = tooltipX + 'px';
    } else {
      const tooltipX = x + this.margins.left + 50;
      this.tooltipElement.style.right = null;
      this.tooltipElement.style.left = tooltipX + 'px';
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
    this.y1.data.expireOldDataColumns();
    if (this.y2) {
      this.y2.data.expireOldDataColumns();
    }

    this.updateXDomain();
    this.updateYDomain('y1');

    if (this.y2) {
      this.updateYDomain('y2');
    }

    this.drawingCanvas.setAttribute('width', this.getRenderCanvasWidth());
    this.draw();
    this.clearRenderingCanvas();
    this.renderCtx.drawImage(
      this.drawingCanvas,
      0,
      0
    );
    this.x.axis.element.call(this.x.axis);
    this.y1.axis.element.call(this.y1.axis);

    if (this.y2) {
      this.y2.axis.element.call(this.y2.axis);
    }

    this.renderTooltip();

    this.rendering = false;
  }

  draw() {
    this.y1.config.renderer.draw({
      dataColumns: this.y1.data.getDataColumns(),
      series: this.y1.config.seriesConfig,
      ctx: this.drawingCtx,
      x: this.x,
      y: this.y1
    });

    if (this.y2) {
      this.y2.config.renderer.draw({
        dataColumns: this.y2.data.getDataColumns(),
        series: this.y2.config.seriesConfig,
        ctx: this.drawingCtx,
        x: this.x,
        y: this.y2
      });
    }
  }

  /**
   * Incremental updates happen when a small number of data points are added,
   * typically at the back of the data columns. Such an update is animated and
   * will keep the rendering status active (this.rendering === true) until
   * the transition has finished.
   */
  renderIncrementalUpdate() {
    this.updateYDomain('y1');
    if (this.y2) {
      this.updateYDomain('y2');
    }

    const dataColumns = this.y1.data.getDataColumns();
    const numberOfDataColumns = dataColumns.length;
    let maxX = dataColumns[numberOfDataColumns - 1][0].x;

    if (this.y2) {
      const dataColumnsY2 = this.y2.data.getDataColumns();
      const numberOfDataColumnsY2 = dataColumnsY2.length;
      maxX = Math.max(maxX, dataColumnsY2[numberOfDataColumnsY2 - 1][0].x);
    }

    const maxXPixels = this.x(maxX);
    const renderCanvasWidth = this.getRenderCanvasWidth();
    const animationEndPosition = renderCanvasWidth - maxXPixels;

    this.drawingCanvas.setAttribute('width', renderCanvasWidth + maxXPixels);

    this.draw();

    const onEnd = () => {
      window.cancelAnimationFrame(this.animationFrameHandle);
      this.y1.data.expireOldDataColumns();
      if (this.y2) {
        this.y2.data.expireOldDataColumns();
      }
      this.updateXDomain();
      this.rendering = false;

      TWEEN.remove(this.tween);

      // We immediately try to schedule a new render phase in order to achieve
      // a smooth animation. render will abort when no new data is available.
      this.render();
    };

    this.slidingSection.attr(
      'transform',
      'translate(' +
        this.margins.left + ',' +
        (this.height - this.margins.bottom) +
      ')'
    );
    this.x.axis.element.call(this.x.axis);
    this.y1.axis.element.call(this.y1.axis);

    if (this.y2) {
      this.y2.axis.element.call(this.y2.axis);
    }

    const self = this;

    this.tween = new TWEEN.Tween({x: 0})
      .to({x: animationEndPosition}, 2000)
      // this cannot be an arrow function as tween.js is passing in x values
      // via the execution context
      .onUpdate(function onUpdate() {
        self.clearRenderingCanvas();
        self.renderCtx.drawImage(
          self.drawingCanvas,
          this.x,
          0
        );
        self.slidingSection.attr(
          'transform',
          'translate(' +
            (self.margins.left + this.x) + ',' +
            (self.height - self.margins.bottom) +
          ')'
        );
        self.renderTooltip();
      })
      .onComplete(onEnd)
      .onStop(onEnd)
      .start();

    // Reduce the number of frames to reduce the CPU usage of the charts.
    // Using this code we only animate every second to third frame. This is
    // something that the user probably cannot recognize given the number of
    // data points that we are presenting in our charts.
    let lastAnimatedTime = 0;
    const animate = time => {
      this.animationFrameHandle = window.requestAnimationFrame(animate);
      if ((time - timeBetweenUpdatesInMillis) >= lastAnimatedTime) {
        this.tween.update(time);
        lastAnimatedTime = time;
      }
    };
    this.animationFrameHandle = window.requestAnimationFrame(animate);
  }

  processNewDataColumns(axis, newDataColumns) {
    if (this[axis].config.renderer.processNewDataColumns) {
      this[axis].config.renderer.processNewDataColumns(newDataColumns);
    }
  }

  updateXDomain() {
    const dataColumns = this.y1.data.getDataColumns();
    const numberOfDataColumns = dataColumns.length;
    let maxX = 0;

    if (numberOfDataColumns > 0) {
      maxX = dataColumns[numberOfDataColumns - 1][0].x;
    }

    if (this.y2) {
      const dataColumnsY2 = this.y2.data.getDataColumns();
      const numberOfDataColumnsY2 = dataColumnsY2.length;

      if (numberOfDataColumnsY2 > 0) {
        maxX = Math.max(maxX, dataColumnsY2[numberOfDataColumnsY2 - 1][0].x);
      }
    }

    const minX = maxX - this.windowSize;

    this.x.domain([minX, maxX]);
  }

  updateYDomain(axis) {
    const minFixed = this[axis].config.min !== undefined;
    const maxFixed = this[axis].config.max !== undefined;
    if (minFixed && maxFixed) {
      this[axis].domain([this[axis].config.min, this[axis].config.max]);
      return;
    }
    const dataColumns = this[axis].data.getDataColumns();
    const numberOfDataColumns = dataColumns.length;

    let minY = Number.POSITIVE_INFINITY;
    let maxY = Number.NEGATIVE_INFINITY;

    for (let i = 0; i < numberOfDataColumns; i++) {
      if (!minFixed) {
        minY = Math.min(this.getMinYFromDataColumn(axis, dataColumns[i]), minY);
      }
      if (!maxFixed) {
        maxY = Math.max(this.getMaxYFromDataColumn(axis, dataColumns[i]), maxY);
      }
    }

    if (!minFixed && !maxFixed) {
      const rangeY = maxY - minY;
      if (rangeY === 0) {
        // add 10% to generate a chartable value range
        minY = minY * 0.9;
        maxY = maxY * 1.1;
      } else {
        minY -= rangeY * 0.05;
        maxY += rangeY * 0.05;
      }
    } else {
      if (minFixed) {
        minY = this[axis].config.min;
      }
      if (maxFixed) {
        maxY = this[axis].config.max;
      }
    }

    if (minY >= maxY) {
      maxY = minY + 1;
    }

    this[axis].domain([minY, maxY]);
  }

  getMinYFromDataColumn(axis, dataColumn) {
    if (this[axis].config.renderer.getMinYFromDataColumn) {
      return this[axis].config.renderer.getMinYFromDataColumn(dataColumn);
    }
    return dataColumn.reduce(minReducer, Number.POSITIVE_INFINITY);
  }

  getMaxYFromDataColumn(axis, dataColumn) {
    if (this[axis].config.renderer.getMaxYFromDataColumn) {
      return this[axis].config.renderer.getMaxYFromDataColumn(dataColumn);
    }
    return dataColumn.reduce(maxReducer, Number.NEGATIVE_INFINITY);
  }

  onResize({height}) {
    this.setDimensions({width: this.width, height});
    this.stopAnimations();
    this.rendering = false;

    // initiate a complete redrawn when there data has been processed and
    // painted before
    if (this.y1.data.getDataColumns().length > 0 &&
        (!this.y2 || this.y2.data.getDataColumns().length > 0)) {
      this.renderBigUpdate();
    }
  }

  setDimensions({width, height}) {
    // avoid dimension updates when nothing changes
    if (this.height === height && this.width === width) {
      return;
    }

    const horizontalMargin = this.margins.left + this.margins.right;
    const verticalMargin = this.margins.top + this.margins.bottom;

    this.width = width;
    this.height = height;

    this.chartContentContainer.style.width = this.width + 'px';
    this.chartContentContainer.style.height = this.height + 'px';

    this.renderCanvas.style.top = this.margins.top + 'px';
    this.renderCanvas.style.left = this.margins.left + 'px';
    this.renderCanvas.setAttribute('width', this.getRenderCanvasWidth());
    this.renderCanvas.setAttribute('height', this.height - verticalMargin);

    this.drawingCanvas.setAttribute('width', this.getDrawingCanvasWidth());
    this.drawingCanvas.setAttribute('height', this.height - verticalMargin);

    this.svg.setAttribute('width', this.width);
    this.svg.setAttribute('height', this.height);

    this.topLine
      .attr('x1', this.margins.left)
      .attr('y1', this.margins.top)
      .attr('x2', this.width - this.margins.right)
      .attr('y2', this.margins.top);

    this.bottomLine
      .attr('x1', this.margins.left)
      .attr('y1', this.height - this.margins.bottom)
      .attr('x2', this.width - this.margins.right)
      .attr('y2', this.height - this.margins.bottom);

    this.x.range([0, this.width - horizontalMargin]);
    const slidingSectionOffsetY = this.height - this.margins.bottom;
    this.slidingSection.attr(
      'transform',
      'translate(' +
        this.margins.left + ', ' +
        (this.height - this.margins.bottom) +
      ')'
    );

    this.y1.range([this.height - verticalMargin, 0]);
    this.y1.axis.element.attr(
      'transform',
      'translate(' +
        this.margins.left + ',' +
        this.margins.top +
      ')'
    );

    if (this.y2) {
      this.y2.range([this.height - verticalMargin, 0]);
      this.y2.axis.element.attr(
        'transform',
        'translate(' +
          (this.width - this.margins.right) + ',' +
          this.margins.top +
        ')'
      );
    }

    this.tooltipLine.attr('y1', slidingSectionOffsetY * -1 + this.margins.top)
      .attr('y2', 0);

    this.glassPane.style.left = this.margins.left + 'px';
    this.glassPane.style.top = this.margins.top + 'px';
    this.glassPane.style.width = (this.width - horizontalMargin) + 'px';
    this.glassPane.style.height = (this.height - verticalMargin) + 'px';
  }

  dispose() {
    this.container.removeChild(this.widthCalculationElement);
    this.container.removeChild(this.chartContentContainer);
    this.focusedMomentSubscription.dispose();
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
