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
    const activeSeries = config.activeSeries[axisName];
    if (!activeSeries[0]) {
      return;
    }

    ctx.globalAlpha = 0.3;

    const blockSizeMillis = config[axisName].dynamicCalculatedBlockSizeMillis || 1000;
    // translates blockSizeMillis to pixelwidth
    const width = x.getRange(x.getDomainTo()) - x.getRange(x.getDomainTo() - blockSizeMillis);

    for (let iColumn = 0, length = dataColumns.length; iColumn < length; iColumn++) {
      const dataColumn = dataColumns[iColumn];

      if (__DEV__ && dataColumn.length !== 2) {
        throw new Error('barPercentage charts can only be used with two data series: total count,percentage');
      }

      const time = dataColumn.time;
      const count = dataColumn[0][1];
      const errorPercentage = dataColumn[1][1];
      const chartHeight = y.getRangeFrom();

      // the timestamp of each block is placed at the end
      const xPos = x.getRange(time) - width + margin;
      const yPos = y.getRangeFrom();
      const countHeight = Math.max(chartHeight - y.getRange(count), 2); // 2px minimum bar height
      const errorHeight = countHeight * errorPercentage;

      ctx.fillStyle = colors[0];
      ctx.fillRect(xPos, yPos - countHeight, width - margin * 2, countHeight);

      if (activeSeries[1]) {
        ctx.fillStyle = colors[1];
        ctx.fillRect(xPos, yPos - errorHeight, width - margin * 2, errorHeight);
      }
    }

    ctx.globalAlpha = 1;
  }
}
