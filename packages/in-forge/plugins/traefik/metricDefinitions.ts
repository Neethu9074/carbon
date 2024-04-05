/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['http.1xx', 'http.2xx', 'http.3xx', 'http.4xx', 'http.5xx'],
    labels: [
      t('in-forge:plugins.labelRequests.1xx'),
      t('in-forge:plugins.labelRequests.2xx'),
      t('in-forge:plugins.labelRequests.3xx'),
      t('in-forge:plugins.labelRequests.4xx'),
      t('in-forge:plugins.labelRequests.5xx'),
      t('in-forge:plugins.traefik.dashboard.configReloadsTotal')
    ],
    min: 0,
    category: [t('in-forge:plugins.traefik.requests')],
    formatter: number
  },
  {
    metrics: ['config_reloads_total'],
    labels: [t('in-forge:plugins.traefik.dashboard.configReloadsTotal')],
    min: 0,
    category: [t('in-forge:plugins.traefik.config')],
    formatter: number
  }
];
