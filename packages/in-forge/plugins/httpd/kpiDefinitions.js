/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.httpd.requests'),
    metric: 'requests',
    formatter: number.compact
  },
  {
    label: t('in-forge:plugins.httpd.trafficKBytes'),
    metric: 'kBytes',
    formatters: number.compact
  }
];
