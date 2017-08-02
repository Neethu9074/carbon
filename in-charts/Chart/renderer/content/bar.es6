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

  // In order for this to work, the first series must be the average calls per second.
  function render(dataColumns) {
    const blockSizeMillis = config[axisName].dynamicCalculatedBlockSizeMillis || 1000;
    // translates blockSizeMillis to pixelwidth
    const width = x.getRange(x.getDomainTo()) - x.getRange(x.getDomainTo() - blockSizeMillis);

    const activeSeries = config.activeSeries[axisName];
    ctx.globalAlpha = 0.3;

    for (let iColumn = 0, length = dataColumns.length; iColumn < length; iColumn++) {
      const dataColumn = dataColumns[iColumn];

      const time = dataColumn.time;
      const chartHeight = y.getRangeFrom();

      // the timestamp of each block is placed at the end
      const xPos = x.getRange(time) - width + margin;

      let yPos = y.getRangeFrom();

      for (let iRows = 0, length = dataColumn.length; iRows < length; iRows++) {
        if (!activeSeries[iRows]) {
          continue;
        }

        const dataRow = dataColumn[iRows];
        const metricValue = dataRow[1];
        const yPosMetric = y.getRange(metricValue);
        const height = Math.max(chartHeight - yPosMetric, 2); // 2px minimum bar height

        ctx.fillStyle = colors[iRows];
        ctx.fillRect(xPos, yPos - height, width - margin * 2, height);

        yPos -= height;
      }
    }

    ctx.globalAlpha = 1;
  }
}
