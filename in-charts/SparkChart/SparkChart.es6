import createDataHolder from 'in-charts/data/dataHolder';
import {updateCanvasDimensions} from 'in-charts/canvas';
import {serverTime$} from 'in-stores/serverTime';
import createScale from 'in-charts/scale';

export default function createSparkChart({width, height, datasource, container, timeframe}) {
  const dataHolder = createDataHolder({numberOfSeries: 1});
  const xScale = createScale();
  xScale.setRangeFrom(0);
  xScale.setRangeTo(width);

  const yScale = createScale();
  yScale.setRangeFrom(height);
  yScale.setRangeTo(0);

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.classList.add('in-spark-chart__canvas');
  container.appendChild(canvas);
  updateCanvasDimensions(canvas, ctx, width, height);


  let timeSubscription;
  if (timeframe.to == null) {
    timeSubscription = serverTime$.subscribe(serverTime => {
      dataHolder.expireDataPointsOlderThan(serverTime - timeframe.windowSize);
      xScale.setDomainFrom(serverTime - timeframe.windowSize);
      xScale.setDomainTo(serverTime);
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

  return {
    dispose
  };


  function dispose() {
    dataSubscription.dispose();
    if (timeSubscription) {
      timeSubscription.dispose();
    }
    container.removeChild(canvas);
  }


  function render() {
    const dataColumns = dataHolder.getDataColumns();
    if (dataColumns.length === 0) {
      return;
    }

    ctx.clearRect(0, 0, width, height);

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, height);
    ctx.lineTo(width, height);
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#203036';
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    for (let columnIndex = 0, len = dataColumns.length;
         columnIndex < len;
         columnIndex++) {
      const dataRow = dataColumns[columnIndex];
      const xToRender = xScale.getRange(dataRow[0]);

      if (columnIndex === 0) {
        ctx.moveTo(xToRender, yScale.getRange(dataRow[1]));
      } else {
        ctx.lineTo(xToRender, yScale.getRange(dataRow[1]));
      }
    }


    ctx.lineWidth = 1;
    ctx.strokeStyle = '#4A90E2';
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
}
