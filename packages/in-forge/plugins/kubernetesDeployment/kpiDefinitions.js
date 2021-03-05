/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

import { resourceQuotaBytes, resourceQuotaNumber } from 'in-kubernetes/formatters';

export default [
  {
    label: t('in-forge:plugins.kubernetesDeployment.cpuRequests'),
    metric: 'pods.required_cpu',
    formatter: resourceQuotaNumber
  },
  {
    label: t('in-forge:plugins.kubernetesDeployment.memoryRequests'),
    metric: 'pods.required_mem',
    formatter: resourceQuotaBytes
  }
];
