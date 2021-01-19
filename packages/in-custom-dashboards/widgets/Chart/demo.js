/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
export const demo = {
  type: 'TIME_SERIES',

  y1: {
    formatter: 'number.compact',
    renderer: 'stackedBar',
    min: 0,
    metrics: [
      {
        label: 'Page Loads',
        metric: 'pageLoads',
        source: 'WEBSITE',
        aggregation: 'SUM',
        tagFilters: []
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
        metric: 'onLoadTime',
        source: 'WEBSITE',
        aggregation: 'MEAN',
        tagFilters: []
      }
    ]
  }
};
