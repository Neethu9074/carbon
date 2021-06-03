/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { identity } from 'in-services/formatters/string';
import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['pull_traffic'],
    labels: [t('in-forge:plugins.ibmCloudContainerRegistry.pullTraffic')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['pull_traffic_quota'],
    labels: [t('in-forge:plugins.ibmCloudContainerRegistry.pullTrafficQuota')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['storage'],
    labels: [t('in-forge:plugins.ibmCloudContainerRegistry.storage')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['storage_quota'],
    labels: [t('in-forge:plugins.ibmCloudContainerRegistry.storageQuota')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['service_name'],
    labels: [t('in-forge:plugins.ibmCloudContainerRegistry.serviceName')],
    min: 0,
    formatter: identity
  }
];
