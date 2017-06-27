export default function createBarContentRenderer({ axisName, config }) {
  const ctx = config.ctx.animationBuffer;
  const y = config.scales[axisName];
  const x = config.scales.x;
  const colors = config[axisName].colors;

  const pixelsBetweenBars = 2;

  return {
    requireExistenceInAllSeries: true,
    processNewDataColumns() {},
    render
  };

  /** In order for this to work, the first series must be the average calls per second. */
  function render(dataColumns) {
    const rollupInMillis = config.rollup;
    const rollup = rollupInMillis / 1000;

    const numberOfBars = dataColumns.length;

    const chartWidth = x.getRangeTo() - x.getRangeFrom();
    const barWidth = chartWidth / (numberOfBars + 0);

    dataColumns.forEach((element, n) => {
      const { xOrigin, yOrigin, xWidth, yHeight } = createRectangle(element, n, barWidth, rollup);

      ctx.fillStyle = colors[0];
      ctx.fillRect(xOrigin, yOrigin, xWidth, yHeight);
    });
  }

  function createRectangle(element, index, barWidth, rollup) {
    const yDomain = element[0][1] * rollup;

    const yOrigin = y.getRangeFrom();
    const yHeight = y.getRange(yDomain) - yOrigin;

    const xOrigin = index * barWidth + x.getRangeFrom();
    const xWidth = barWidth - pixelsBetweenBars;

    return { xOrigin, yOrigin, xWidth, yHeight };
  }
}
