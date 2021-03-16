/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { t } from 'in-i18n';

export const demo = {
  type: 'TIME_SERIES',

  y1: {
    formatter: 'number.compact',
    renderer: 'stackedBar',
    min: 0,
    metrics: [
      {
        label: t('in-custom-dashboards:widgets.demo.pageLoads'),
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
        label: t('in-custom-dashboards:widgets.demo.onLoadTime'),
        metric: 'onLoadTime',
        source: 'WEBSITE',
        aggregation: 'MEAN',
        tagFilters: []
      }
    ]
  }
};
