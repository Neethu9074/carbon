export default function createBarContentRenderer({ axisName, config }) {
  const ctx = config.ctx.animationBuffer;
  const y = config.scales[axisName];
  const x = config.scales.x;
  const colors = config[axisName].colors;
  const pixelsBetweenBars = 2;
  const pixelsBetweenBarsHalf = pixelsBetweenBars / 2;

  return {
    requireExistenceInAllSeries: true,
    processNewDataColumns() {},
    render
  };

  /** In order for this to work, the first series must be the average calls per second. */
  function render(dataColumns) {
    const width = calculateBarWidth(dataColumns);
    const activeSeries = config.activeSeries[axisName];

    for (let iColumn = 0, length = dataColumns.length; iColumn < length; iColumn++) {
      const dataColumn = dataColumns[iColumn];

      const time = dataColumn.time;
      const chartHeight = y.getRangeFrom();
      const xPos = x.getRange(time) + pixelsBetweenBarsHalf;

      let yPos = y.getRangeFrom();
      for (let iRows = 0, length = dataColumn.length; iRows < length; iRows++) {
        if (!activeSeries[iRows]) {
          continue;
        }
        const dataRow = dataColumn[iRows];
        const metricValue = dataRow[1];
        const yPosMetric = y.getRange(metricValue);
        const height = chartHeight - yPosMetric;

        ctx.fillStyle = colors[iRows];
        ctx.fillRect(xPos, yPos - height, width, height);

        yPos -= height;
      }
    }
  }

  function calculateBarWidth(dataColumns) {
    const numberOfBars = dataColumns.length;
    const chartWidth = x.getRangeTo() - x.getRangeFrom();
    return chartWidth / numberOfBars - pixelsBetweenBars;
  }
}
