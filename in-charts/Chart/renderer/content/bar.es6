export default function createBarContentRenderer({ axisName, config }) {
  const ctx = config.ctx.animationBuffer;
  const y = config.scales[axisName];
  const x = config.scales.x;
  const colors = config[axisName].colors;
  const margin = 1;

  return {
    requireExistenceInAllSeries: true,
    processNewDataColumns() {},
    render
  };

  /** In order for this to work, the first series must be the average calls per second. */
  function render(dataColumns) {
    const width = calculateBarWidth(dataColumns);
    const activeSeries = config.activeSeries[axisName];
    ctx.globalAlpha = 0.3;

    for (let iColumn = 0, length = dataColumns.length; iColumn < length; iColumn++) {
      const dataColumn = dataColumns[iColumn];

      const time = dataColumn.time;
      const chartHeight = y.getRangeFrom();
      const xPos = x.getRange(time) - width / 2 + margin;
      let yPos = y.getRangeFrom();

      for (let iRows = 0, length = dataColumn.length; iRows < length; iRows++) {
        if (!activeSeries[iRows]) {
          continue;
        }
        const dataRow = dataColumn[iRows];
        const metricValue = dataRow[1];
        const yPosMetric = y.getRange(metricValue);
        // 2px minimum bar height
        const height = Math.max(chartHeight - yPosMetric, 2);

        ctx.fillStyle = colors[iRows];
        ctx.fillRect(xPos, yPos - height, width - margin * 2, height);

        yPos -= height;
      }
    }

    ctx.globalAlpha = 1;
  }

  function calculateBarWidth(dataColumns) {
    const numberOfBars = dataColumns.length;
    const chartWidth = x.getRangeTo() - x.getRangeFrom();
    return chartWidth / numberOfBars;
  }
}
