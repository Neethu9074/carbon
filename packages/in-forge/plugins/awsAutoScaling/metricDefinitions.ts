/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { number, zeroDecimalPlaces } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: [
      'group_in_service_instances',
      'group_pending_instances',
      'group_standby_instances',
      'group_terminating_instances',
      'group_total_instances',
      'group_in_service_capacity',
      'group_pending_capacity',
      'group_standby_capacity',
      'group_terminating_capacity',
      'group_total_capacity'
    ],
    labels: [
      t('in-forge:plugins.awsAutoScaling.labelGroupInServiceInstances'),
      t('in-forge:plugins.awsAutoScaling.labelGroupPendingInstances'),
      t('in-forge:plugins.awsAutoScaling.labelGroupStandbyInstances'),
      t('in-forge:plugins.awsAutoScaling.labelGroupTerminatingInstances'),
      t('in-forge:plugins.awsAutoScaling.labelGroupTotalInstances'),
      t('in-forge:plugins.awsAutoScaling.labelGroupInServiceCapacity'),
      t('in-forge:plugins.awsAutoScaling.labelGroupPendingCapacity'),
      t('in-forge:plugins.awsAutoScaling.labelGroupStandbyCapacity'),
      t('in-forge:plugins.awsAutoScaling.labelGroupTerminatingCapacity'),
      t('in-forge:plugins.awsAutoScaling.labelGroupTotalCapacity')
    ],
    category: [t('in-forge:plugins.awsAutoScaling.category.autoScalingGroup')],
    formatter: zeroDecimalPlaces,
    min: 0
  },
  {
    metrics: [
      'predictive_scaling_load_forecast',
      'predictive_scaling_capacity_forecast',
      'predictive_scaling_metric_pair_correlation'
    ],
    labels: [
      t('in-forge:plugins.awsAutoScaling.labelPredictiveScalingLoadForecast'),
      t('in-forge:plugins.awsAutoScaling.labelPredictiveScalingCapacityForecast'),
      t('in-forge:plugins.awsAutoScaling.labelPredictiveScalingMetricPairCorrelation')
    ],
    category: [t('in-forge:plugins.awsAutoScaling.category.predictiveScaling')],
    formatter: number.detailed,
    min: 0
  }
];
