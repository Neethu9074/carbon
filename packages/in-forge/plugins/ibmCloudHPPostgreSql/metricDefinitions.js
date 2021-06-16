/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { percentage } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metric: getDynamicMetricMatch('nodes', 'cpuPercent', t('in-forge:plugins.ibmCloudHPPostgreSql.nodeId')),
    label: t('in-forge:plugins.ibmCloudHPPostgreSql.usedPercent'),
    category: [t('in-forge:plugins.ibmCloudHPPostgreSql.cpu')],
    min: 0,
    formatter: percentage
  },
  {
    metric: getDynamicMetricMatch('nodes', 'diskPercent', t('in-forge:plugins.ibmCloudHPPostgreSql.nodeId')),
    label: t('in-forge:plugins.ibmCloudHPPostgreSql.usedPercent'),
    category: [t('in-forge:plugins.ibmCloudHPPostgreSql.disk')],
    min: 0,
    formatter: percentage
  },
  {
    metric: getDynamicMetricMatch('nodes', 'memoryPercent', t('in-forge:plugins.ibmCloudHPPostgreSql.nodeId')),
    label: t('in-forge:plugins.ibmCloudHPPostgreSql.usedPercent'),
    category: [t('in-forge:plugins.ibmCloudHPPostgreSql.memory')],
    min: 0,
    formatter: percentage
  }
];
