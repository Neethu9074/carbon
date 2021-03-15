/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { resourceQuotaPercentage } from 'in-kubernetes/formatters';
import { t } from 'in-i18n';

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
