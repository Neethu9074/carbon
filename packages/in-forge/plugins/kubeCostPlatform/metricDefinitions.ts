/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

// @ts-expect-error
import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { number, percentage } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: [
      getDynamicMetricMatch('namespaceCostList', 'cpuCost', t('in-kubernetes:dashboards.kubecost.namespace')),
      getDynamicMetricMatch('namespaceCostList', 'gpuCost', t('in-kubernetes:dashboards.kubecost.namespace')),
      getDynamicMetricMatch('namespaceCostList', 'networkCost', t('in-kubernetes:dashboards.kubecost.namespace')),
      getDynamicMetricMatch('namespaceCostList', 'pvCost', t('in-kubernetes:dashboards.kubecost.namespace')),
      getDynamicMetricMatch('namespaceCostList', 'loadBalancerCost', t('in-kubernetes:dashboards.kubecost.namespace')),
      getDynamicMetricMatch('namespaceCostList', 'sharedCost', t('in-kubernetes:dashboards.kubecost.namespace')),
      getDynamicMetricMatch('namespaceCostList', 'ramCost', t('in-kubernetes:dashboards.kubecost.namespace')),
      getDynamicMetricMatch('namespaceCostList', 'totalCost', t('in-kubernetes:dashboards.kubecost.namespace'))
    ],
    labels: [
      t('in-kubernetes:dashboards.kubecost.cpuCost'),
      t('in-kubernetes:dashboards.kubecost.gpuCost'),
      t('in-kubernetes:dashboards.kubecost.networkCost'),
      t('in-kubernetes:dashboards.kubecost.pvCost'),
      t('in-kubernetes:dashboards.kubecost.loadBalancerCost'),
      t('in-kubernetes:dashboards.kubecost.sharedCost'),
      t('in-kubernetes:dashboards.kubecost.ramCost'),
      t('in-kubernetes:dashboards.kubecost.totalCost')
    ],
    category: [t('in-kubernetes:dashboards.kubecost.namespaceCumulativeCost')],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      getDynamicMetricMatch('namespaceCostList', 'trend', t('in-kubernetes:dashboards.kubecost.namespace')),
      getDynamicMetricMatch('namespaceCostList', 'totalEfficiency', t('in-kubernetes:dashboards.kubecost.namespace'))
    ],
    labels: [t('in-kubernetes:dashboards.kubecost.trend'), t('in-kubernetes:dashboards.kubecost.totalEfficiency')],
    category: [t('in-kubernetes:dashboards.kubecost.namespaceCumulativeCost')],
    min: 0,
    formatter: percentage
  }
];
