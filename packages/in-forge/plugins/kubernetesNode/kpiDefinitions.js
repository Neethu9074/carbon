/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

import { resourceQuotaBytes, resourceQuotaNumber } from 'in-kubernetes/formatters';

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
