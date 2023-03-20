/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

//@ts-expect-error needs ts migration
import getKubernetesWorkloadController from 'in-kubernetes/subscriptions/getKubernetesWorkloadController';
//@ts-expect-error needs ts migration
import getKubernetesNamespace from 'in-kubernetes/subscriptions/getKubernetesNamespace';
//@ts-expect-error needs ts migration
import getKubernetesService from 'in-kubernetes/subscriptions/getKubernetesService';
//@ts-expect-error needs ts migration
import getKubernetesNode from 'in-kubernetes/subscriptions/getKubernetesNode';
import { bytesZeroDecimalPlaces, twoDecimalPlaces, zeroDecimalPlaces } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export const sizeByConfigs = [
  {
    value: 'cpuLimits',
    format: twoDecimalPlaces,
    label: t('in-kubernetes:dashboards.cpuLimits')
  },
  {
    value: 'cpuRequests',
    format: twoDecimalPlaces,
    label: t('in-kubernetes:dashboards.cpuRequests')
  },
  {
    value: 'memoryLimits',
    format: bytesZeroDecimalPlaces,
    label: t('in-kubernetes:dashboards.memoryLimits')
  },
  {
    value: 'memoryRequests',
    format: bytesZeroDecimalPlaces,
    label: t('in-kubernetes:dashboards.memoryRequests')
  },
  {
    value: 'containers',
    format: zeroDecimalPlaces,
    label: t('in-kubernetes:dashboards.containers')
  }
];
export const namespaceGroupings = [
  {
    value: 'DEPLOYMENT',
    label: t('in-kubernetes:dashboards.deployment'),
    getEntity: getKubernetesWorkloadController
  },
  {
    value: 'SERVICE',
    label: t('in-kubernetes:dashboards.service'),
    getEntity: getKubernetesService
  },
  {
    value: 'NODE',
    label: t('in-kubernetes:dashboards.node'),
    getEntity: getKubernetesNode
  }
];
export const clusterGroupings = [
  ...namespaceGroupings,
  {
    value: 'NAMESPACE',
    label: t('in-kubernetes:dashboards.namespace'),
    getEntity: getKubernetesNamespace
  }
];
