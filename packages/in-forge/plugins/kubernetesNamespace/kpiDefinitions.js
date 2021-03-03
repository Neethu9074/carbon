/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

import { resourceQuotaPercentage } from 'in-kubernetes/formatters';

export default [
  {
    label: t('in-forge:plugins.kubernetesNamespace.cpuRequests'),
    metric: 'required_cpu_percentage',
    formatter: resourceQuotaPercentage
  },
  {
    label: t('in-forge:plugins.kubernetesNamespace.memoryRequests'),
    metric: 'required_mem_percentage',
    formatter: resourceQuotaPercentage
  }
];
