/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

import { number } from 'in-services/formatters/number';

export default [
  {
    metric: 'connectorCount',
    label: t('in-forge:plugins.kafkaConnectCluster.connectorCount'),
    formatter: number
  }
];
