/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { greaterThanZeroFormatter } from 'in-forge/plugins/rabbitMq/formatters';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.rabbitMqCluster.nodesCount'),
    metric: 'nodes_count',
    formatter: greaterThanZeroFormatter
  },
  {
    label: t('in-forge:plugins.rabbitMqCluster.connections'),
    metric: 'overview.connections',
    formatter: greaterThanZeroFormatter
  }
];
