/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

import { number, timeByMillisTwoDecimalPlaces } from 'in-services/formatters/number';

export default [
  {
    label: t('in-forge:plugins.awsEs.labelSearchLatency'),
    metric: 'search_latency',
    formatter: timeByMillisTwoDecimalPlaces
  },
  {
    label: t('in-forge:plugins.awsEs.labelClusterStatusRed'),
    metric: 'cluster_status_red',
    formatter: number.compact
  }
];
