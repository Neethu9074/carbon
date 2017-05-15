import { on } from 'reactive-observables';
import { sortedIndexBy, groupBy } from 'lodash';

import { updateCanvasDimensions } from 'in-charts/canvas';
import createDataHolder from 'in-charts/data/dataHolder';
import { serverTime$ } from 'in-stores/serverTime';
import createScale from 'in-charts/scale';

import { highlightedMoment$, setHighlightedMoment, clearHighlightedMoment } from 'in-stores/timeline';

import './SparkChart.less';

const block = 'in-spark-chart';
const windowSizeFactor = 0.1;
const fractionOfDataCanBeFlat = 0.9;

export default function createSparkChart({
  width,
  height,
  datasource,
  container,
  timeframe,
  tooltipFormatter,
  design = 'light',
  wiggleRoom
}) {
  let metricLineStrokeColor;
  let metricLineFillColor;
  let metricAxisStrokeColor;
  if (design === 'light') {
    metricLineStrokeColor = '#2c4048';
    metricLineFillColor = '#eef2f4';
    metricAxisStrokeColor = '#203036';
  } else {
    metricLineStrokeColor = '#eef2f4';
    metricLineFillColor = '#2c4048';
    metricAxisStrokeColor = '#ffffff';
  }

  const dataHolder = createDataHolder({ numberOfSeries: 1 });
  const xScale = createScale();
  xScale.setRangeFrom(0);
  xScale.setRangeTo(width);

  const yScale = createScale();
  yScale.setRangeFrom(height);
  yScale.setRangeTo(0);

  const wrapper = document.createElement('div');
  wrapper.style.width = `${width}px`;
  wrapper.style.height = `${height}px`;
  wrapper.classList.add(`${block}__wrapper`);
  container.appendChild(wrapper);

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.classList.add(`${block}__canvas`);
  wrapper.appendChild(canvas);
  updateCanvasDimensions(canvas, ctx, width, height);

  const tooltipLine = document.createElement('div');
  tooltipLine.classList.add(`${block}__tooltip-line`);
  wrapper.appendChild(tooltipLine);

  const tooltipContainer = document.createElement('div');
  tooltipContainer.classList.add(`${block}__tooltip`);
  wrapper.appendChild(tooltipContainer);

  const glassPane = document.createElement('div');
  glassPane.classList.add(`${block}__glass-pane`);
  wrapper.appendChild(glassPane);

  // draw initial axis
  drawAxis();

  let timeSubscription;
  if (timeframe.to == null) {
    timeSubscription = serverTime$.subscribe(serverTime => {
      dataHolder.expireDataPointsOlderThan(serverTime - timeframe.windowSize);
      xScale.setDomainFrom(serverTime - timeframe.windowSize);
      xScale.setDomainTo(serverTime - wiggleRoom);
      render();
    });
  } else {
    xScale.setDomainFrom(timeframe.to - timeframe.windowSize);
    xScale.setDomainTo(timeframe.to);
  }

  const dataSubscription = datasource.subscribe(dataPoints => {
    dataHolder.insertSorted(dataPoints);

    const allDataColumns = dataHolder.getDataColumns();
    updateYScale(allDataColumns);

    if (timeframe.to != null) {
      render();
    }
  });

  on(glassPane, 'mousemove').subscribe(e => setHighlightedMoment(xScale.getDomain(e.offsetX)));

  on(glassPane, 'mouseleave').subscribe(clearHighlightedMoment);

  const highlightedMomentSubscription = highlightedMoment$.subscribe(highlightedMoment => {
    if (highlightedMoment) {
      tooltipContainer.style.display = 'block';
      tooltipLine.style.display = 'block';
      tooltipLine.style.left = `${xScale.getRange(highlightedMoment)}px`;
      fillTooltip(highlightedMoment);
    } else {
      tooltipContainer.style.display = 'none';
      tooltipLine.style.display = 'none';
    }
  });

  return {
    dispose
  };

  function dispose() {
    dataSubscription.dispose();
    highlightedMomentSubscription.dispose();
    if (timeSubscription) {
      timeSubscription.dispose();
    }
    container.removeChild(wrapper);
  }

  function render() {
    const dataColumns = dataHolder.getDataColumns();
    if (dataColumns.length === 0) {
      return;
    }

    ctx.clearRect(0, 0, width, height);

    ctx.beginPath();
    let xToRender;
    let firstX;
    for (let columnIndex = 0, len = dataColumns.length; columnIndex < len; columnIndex++) {
      const dataRow = dataColumns[columnIndex];
      xToRender = xScale.getRange(dataRow[0]);

      if (columnIndex === 0) {
        firstX = xToRender;
        ctx.moveTo(xToRender, yScale.getRange(dataRow[1]));
      } else {
        ctx.lineTo(xToRender, yScale.getRange(dataRow[1]));
      }
    }

    ctx.lineWidth = 1;
    ctx.lineTo(xToRender, yScale.getRangeFrom());
    ctx.lineTo(firstX, yScale.getRangeFrom());
    ctx.closePath();
    ctx.fillStyle = metricLineFillColor;
    ctx.fill();
    ctx.strokeStyle = metricLineStrokeColor;
    ctx.stroke();

    drawAxis();
  }

  function drawAxis() {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, height);
    ctx.lineTo(width, height);
    ctx.lineWidth = 1;
    ctx.strokeStyle = metricAxisStrokeColor;
    ctx.stroke();
    ctx.closePath();
  }

  function updateYScale(dataColumns) {
    let min = dataColumns[0][1];
    let max = dataColumns[0][1];

    for (let i = 1, len = dataColumns.length; i < len; i++) {
      min = Math.min(min, dataColumns[i][1]);
      max = Math.max(max, dataColumns[i][1]);
    }

    yScale.setDomainFrom(min);
    yScale.setDomainTo(max);
  }

  function fillTooltip(highlightedMoment) {
    const dataPoint = lookForDataPoint(highlightedMoment);
    if (!dataPoint || dataPoint[1] == null) {
      tooltipContainer.style.display = 'none';
      return;
    }

    let valueToShow = dataPoint[1];
    if (tooltipFormatter) {
      valueToShow = tooltipFormatter(dataPoint[1]);
    }

    tooltipContainer.textContent = valueToShow;
    const x = xScale.getRange(dataPoint[0]);
    if (x > width / 2) {
      const position = width - x + 10;
      tooltipContainer.style.right = `${position}px`;
      tooltipContainer.style.left = null;
    } else {
      const position = x + 10;
      tooltipContainer.style.left = `${position}px`;
      tooltipContainer.style.right = null;
    }
  }

  function lookForDataPoint(highlightedMoment) {
    const dataColumns = dataHolder.getDataColumns();
    if (dataColumns.length === 0) {
      return null;
    }
    const i = sortedIndexBy(dataColumns, highlightedMoment, column => {
      if (column.time) {
        return column.time;
      }
      // this iteratee function will be called for the search value as well
      return column;
    });

    const noDataForHighlightedMoment = i == 0 || i == dataColumns.length;

    if (noDataForHighlightedMoment) {
      return null;
    }

    const window = dataWindow(highlightedMoment, dataColumns);

    const standardElement = findStandardElement(window);
    const dataIsFlat = standardElement !== undefined;

    return dataIsFlat ? findClosestAnomaly(window, standardElement) : dataColumns[i];
  }

  function dataWindow(timestamp, dataColumns) {
    const xFrom = xScale.getRangeFrom();
    const xTo = xScale.getRangeTo();

    const windowSize = (xTo - xFrom) * windowSizeFactor;

    const xRangeOfHighlighted = xScale.getRange(timestamp);
    const left = xScale.getDomain(xRangeOfHighlighted - windowSize);
    const right = xScale.getDomain(xRangeOfHighlighted + windowSize);

    return dataColumns.filter(c => c[0] >= left && c[0] <= right);
  }

  function findStandardElement(dataWindow) {
    const toleratedLength = dataWindow.length * fractionOfDataCanBeFlat;

    const groupedByValue = groupBy(dataWindow, c => c[1]);

    return Object.keys(groupedByValue).find(key => groupedByValue[key].length > toleratedLength);
  }

  function findClosestAnomaly(dataWindow, standardElement) {
    const index = Math.floor(dataWindow.length * 0.5);
    const anomalyOffset = dataWindow.reduce((acc, cur, idx) => {
      if (cur[1] != standardElement && Math.abs(index - idx) < Math.abs(acc)) {
        return index - idx;
      } else {
        return acc;
      }
    }, index - 1);

    return dataWindow[index + anomalyOffset];
  }
}
