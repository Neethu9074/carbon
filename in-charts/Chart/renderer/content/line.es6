export default function createLineContentRenderer({axisName, config}) {
  const ctx = config.ctx.animationBuffer;
  const x = config.scales.x;
  const y = config.scales[axisName];
  const colors = config[axisName].colors;


  return {
    requireExistenceInAllSeries: false,
    processNewDataColumns() {},
    render
  };

  function render(dataColumns) {
    for (let seriesIndex = 0; seriesIndex < config[axisName].numberOfSeries; seriesIndex++) {
      ctx.beginPath();

      let previousX = Number.MAX_VALUE * -1;

      // going left to right
      for (let columnIndex = 0, len = dataColumns.length;
           columnIndex < len;
           columnIndex++) {
        const dataColumn = dataColumns[columnIndex];
        const dataRow = dataColumn[seriesIndex];

        // existense of data points in all rows is not guaranteed - skip column for this series
        if (!dataRow) {
          continue;
        }

        const xToRender = x.getRange(dataRow[0]);

        if ((xToRender - previousX) > config.maxDistanceBetweenPoints || columnIndex === 0) {
          ctx.moveTo(xToRender, y.getRange(dataRow[1]));
        } else {
          ctx.lineTo(xToRender, y.getRange(dataRow[1]));
          // console.log('line to', xToRender, y.getRange(dataRow.y));
        }

        previousX = xToRender;
      }

      ctx.lineWidth = 2;
      ctx.strokeStyle = colors[seriesIndex];
      ctx.stroke();
    }
  }
}
