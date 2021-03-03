/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

import { resourceQuotaBytes, resourceQuotaNumber } from 'in-kubernetes/formatters';
export default [
  {
    label: t('in-forge:plugins.kubernetesService.cpuRequests'),
    metric: 'cpuRequests',
    formatter: resourceQuotaNumber
  },
  {
    label: t('in-forge:plugins.kubernetesService.memoryRequests'),
    metric: 'memoryRequests',
    formatter: resourceQuotaBytes
  }
];
