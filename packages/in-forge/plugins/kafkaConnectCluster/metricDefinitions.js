/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metric: 'connectorCount',
    label: t('in-forge:plugins.kafkaConnectCluster.connectorCount'),
    formatter: number
  }
];
