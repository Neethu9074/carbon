/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { number, percentage } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metric: 'active_controller_count',
    label: t('in-forge:plugins.awsMskCluster.activeControllerCount'),
    category: [t('in-forge:plugins.awsMskCluster.controller')],
    formatter: number
  },
  {
    metric: 'global_topic_count',
    label: t('in-forge:plugins.awsMskCluster.topicCount'),
    category: [t('in-forge:plugins.awsMskCluster.topic')],
    formatter: number
  },
  {
    metric: 'global_partition_count',
    label: t('in-forge:plugins.awsMskCluster.partitionCount'),
    category: [t('in-forge:plugins.awsMskCluster.partition')],
    formatter: number
  },
  {
    metric: 'offline_partitions_count',
    label: t('in-forge:plugins.awsMskCluster.offlinePartitionCount'),
    category: [t('in-forge:plugins.awsMskCluster.partition')],
    formatter: number
  },
  {
    metric: 'kafka_data_logs_disk_used',
    label: t('in-forge:plugins.awsMskCluster.dataLogs'),
    category: [t('in-forge:plugins.awsMskCluster.partition')],
    formatter: percentage
  }
];
