/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { resourceQuotaBytes, resourceQuotaNumber } from 'in-kubernetes/formatters';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.openshiftDeploymentConfig.cpuReq'),
    metric: 'pods.required_cpu',
    formatter: resourceQuotaNumber
  },
  {
    label: t('in-forge:plugins.openshiftDeploymentConfig.memoryReq'),
    metric: 'pods.required_mem',
    formatter: resourceQuotaBytes
  }
];
