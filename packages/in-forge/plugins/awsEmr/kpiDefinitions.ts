/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { zeroDecimalPlaces } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.awsEmr.labelClusterNodesActive'),
    metric: 'active_nodes',
    formatter: zeroDecimalPlaces
  },
  {
    label: t('in-forge:plugins.awsEmr.labelAppsRunning'),
    metric: 'apps_running',
    formatter: zeroDecimalPlaces
  }
];
