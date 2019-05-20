const CIRCLE_ARC = 2 * Math.PI;

export default function createPointContentRenderer({ axisName, config }) {
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
    const activeSeries = config.activeSeries[axisName];
    for (let seriesIndex = 0; seriesIndex < config[axisName].numberOfSeries; seriesIndex++) {
      if (activeSeries[seriesIndex] === false) {
        continue;
      }
      ctx.lineWidth = 1;
      ctx.strokeStyle = colors[seriesIndex];

      // going left to right
      for (let columnIndex = 0, len = dataColumns.length; columnIndex < len; columnIndex++) {
        const dataColumn = dataColumns[columnIndex];
        const dataRow = dataColumn[seriesIndex];

        // existense of data points in all rows is not guaranteed - skip column for this series
        if (!dataRow) {
          continue;
        }

        ctx.beginPath();
        ctx.arc(x.getRange(dataRow[0]), y.getRange(dataRow[1]), 2, 0, CIRCLE_ARC);
        ctx.closePath();
        ctx.stroke();
      }
    }
  }
}
