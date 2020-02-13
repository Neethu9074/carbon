export const demo = {
  type: 'TIME_SERIES',

  y1: {
    formatter: 'number.compact',
    renderer: 'stackedBar',
    min: 0,
    metrics: [
      {
        label: 'Page Loads',
        metricConfiguration: {
          metric: 'pageLoads',
          source: 'WEBSITE',
          aggregation: 'SUM',
          tagFilters: []
        }
      }
    ]
  },

  y2: {
    formatter: 'millis.detailed',
    renderer: 'line',
    min: 0,
    metrics: [
      {
        label: 'OnLoad Time',
        metricConfiguration: {
          metric: 'onLoadTime',
          source: 'WEBSITE',
          aggregation: 'MEAN',
          tagFilters: []
        }
      }
    ]
  }
};
