/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { zeroDecimalPlaces } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.ibmCloudContainerRegistry.pullTraffic'),
    metric: 'pull_traffic',
    formatter: zeroDecimalPlaces
  },
  {
    label: t('in-forge:plugins.ibmCloudContainerRegistry.storageQuota'),
    metric: 'storage_quota',
    formatter: zeroDecimalPlaces
  }
];
