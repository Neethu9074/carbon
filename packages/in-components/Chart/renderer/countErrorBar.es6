import { number, percentage } from 'in-services/formatters/number';
import bar from 'in-components/Chart/renderer/bar';

export default {
  render: ({ metrics, axis, colors, scale, config }) => {
    const countDataSeries = metrics[0];
    bar.render({ axis, dataSeries: countDataSeries, color: colors[0], scale, config });

    let errorMetrics = [];
    if (countDataSeries.length == 0) {
      errorMetrics = metrics[1];
    } else {
      const countMetricsAsMap = dataSeriesAsDiscreteTimeValueMap(countDataSeries);
      const errorDataSeries = metrics[1];

      for (let i = 0; i < errorDataSeries.length; i++) {
        const dataPoint = errorDataSeries[i];
        if (countMetricsAsMap[dataPoint[0]]) {
          errorMetrics.push([dataPoint[0], dataPoint[1] * countMetricsAsMap[dataPoint[0]]]);
        }
      }
    }

    bar.render({ axis, dataSeries: errorMetrics, color: colors[1], scale, config });
  },

  enrich: (config, axis) => {
    axis.valuesDependOnEachOther = true;
    config.addBlockSizeMillisForAxis(axis);
    axis.formatter = [number, percentage];
    axis.colors = ['#b3edf7', '#ff4300'];
  }
};

function dataSeriesAsDiscreteTimeValueMap(dataSeries) {
  const timeValueMap = {};
  for (let i = 0; i < dataSeries.length; i++) {
    const dataPoint = dataSeries[i];
    timeValueMap[dataPoint[0]] = dataPoint[1];
  }
  return timeValueMap;
}
