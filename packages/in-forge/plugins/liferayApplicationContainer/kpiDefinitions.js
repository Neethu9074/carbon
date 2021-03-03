/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.liferayApplicationContainer.averageTime', 'Average Time'),
    metric: 'portalStatistics.averageTime'
  },
  {
    label: t('in-forge:plugins.liferayApplicationContainer.requestCount', 'Request Count'),
    metric: 'portalStatistics.requestCount'
  }
];
