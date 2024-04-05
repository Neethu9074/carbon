/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { resourceQuotaBytes, resourceQuotaNumber } from 'in-kubernetes/formatters';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.kubernetesNode.cpuRequests'),
    metric: 'required_cpu_percentage',
    formatter: resourceQuotaNumber
  },
  {
    label: t('in-forge:plugins.kubernetesNode.memoryRequests'),
    metric: 'required_mem_percentage',
    formatter: resourceQuotaBytes
  }
];
