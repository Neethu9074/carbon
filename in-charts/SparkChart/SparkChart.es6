import { on } from 'reactive-observables';
import { sortedIndexBy } from 'lodash';

import { updateCanvasDimensions } from 'in-charts/canvas';
import createDataHolder from 'in-charts/data/dataHolder';
import icons from 'in-components/SvgIcon/registry.json';
import { serverTime$ } from 'in-stores/serverTime';
import createScale from 'in-charts/scale';

import { highlightedMoment$, setHighlightedMoment, clearHighlightedMoment } from 'in-stores/timeline';

import './SparkChart.less';

const block = 'in-spark-chart';

export default function createSparkChart({
  width,
  height,
  datasource,
  container,
  timeframe,
  tooltipFormatter,
  wiggleRoom
}) {
  const dataHolder = createDataHolder({ numberOfSeries: 1 });
  const xScale = createScale();
  xScale.setRangeFrom(0);
  xScale.setRangeTo(width);

  const yScale = createScale();
  yScale.setRangeFrom(height - 2);
  yScale.setRangeTo(2);

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

  const noDataIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  noDataIcon.classList.add(`${block}__no-data`);
  noDataIcon.setAttribute('viewBox', `0 0 ${icons.crossed_circle.width} ${icons.crossed_circle.height}`);
  const noDataIconPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  noDataIconPath.setAttribute('d', icons.crossed_circle.path);
  noDataIconPath.style.fill = '#bec7cb';
  noDataIcon.appendChild(noDataIconPath);
  wrapper.appendChild(noDataIcon);

  const tooltipLine = document.createElement('div');
  tooltipLine.classList.add(`${block}__tooltip-line`);
  wrapper.appendChild(tooltipLine);

  const tooltipContainer = document.createElement('div');
  tooltipContainer.classList.add(`${block}__tooltip`);
  wrapper.appendChild(tooltipContainer);

  const glassPane = document.createElement('div');
  glassPane.classList.add(`${block}__glass-pane`);
  wrapper.appendChild(glassPane);

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
      noDataIcon.style.display = 'block';
      return;
    }
    noDataIcon.style.display = 'none';

    ctx.clearRect(0, 0, width, height);
    const singlePointsToRender = [];

    ctx.beginPath();
    for (let columnIndex = 0, len = dataColumns.length; columnIndex < len; columnIndex++) {
      const dataRow = dataColumns[columnIndex];
      const xToRender = xScale.getRange(dataRow[0]);
      const yToRender = yScale.getRange(dataRow[1]);

      // draw these points later on as otherwise we would fill the line chart.
      singlePointsToRender.push({
        x: xToRender,
        y: yToRender
      });

      if (columnIndex === 0) {
        ctx.moveTo(xToRender, yToRender);
      } else {
        ctx.lineTo(xToRender, yToRender);
      }
    }

    ctx.lineWidth = 1;
    ctx.strokeStyle = '#00D6D8';
    ctx.stroke();

    ctx.fillStyle = '#00D6D8';
    singlePointsToRender.forEach(renderPoint);
  }

  function renderPoint(point) {
    ctx.beginPath();
    ctx.arc(point.x, point.y, 2, 0, 2 * Math.PI, false);
    ctx.fill();
  }

  function updateYScale(dataColumns) {
    let min = dataColumns[0][1];
    let max = dataColumns[0][1];

    for (let i = 1, len = dataColumns.length; i < len; i++) {
      min = Math.min(min, dataColumns[i][1]);
      max = Math.max(max, dataColumns[i][1]);
    }

    if (min === max) {
      // Center align data series which are flat lines
      max = max + 1;
      min = min - 1;
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

    return dataColumns[i];
  }
}
