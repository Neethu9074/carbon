/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { resourceQuotaBytes, resourceQuotaNumber } from 'in-kubernetes/formatters';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.kubernetesNode.cpuRequests'),
    metric: 'cpu.total_usage',
    formatter: resourceQuotaNumber
  },
  {
    label: t('in-forge:plugins.kubernetesNode.memoryRequests'),
    metric: 'memory.usage',
    formatter: resourceQuotaBytes
  }
];
