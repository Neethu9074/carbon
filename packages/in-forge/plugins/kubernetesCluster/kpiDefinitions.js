/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { percentage } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.kubernetesCluster.cpuRequests'),
    metric: 'requiredCapacityCPURatio',
    formatter: percentage.compact
  },
  {
    label: t('in-forge:plugins.kubernetesCluster.memoryRequests'),
    metric: 'requiredCapacityMemoryRatio',
    formatter: percentage.compact
  }
];
