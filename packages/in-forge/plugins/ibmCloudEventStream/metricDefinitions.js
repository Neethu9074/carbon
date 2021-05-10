/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metric: getDynamicMetricMatch(
      'members',
      'instance_bytes_in_per_second',
      t('in-forge:plugins.ibmCloudEventStream.instance')
    ),
    label: t('in-forge:plugins.ibmCloudEventStream.instanceBytesIn'),
    category: [t('in-forge:plugins.ibmCloudEventStream.instance')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch(
      'members',
      'instance_bytes_out_per_second',
      t('in-forge:plugins.ibmCloudEventStream.instance')
    ),
    label: t('in-forge:plugins.ibmCloudEventStream.instanceBytesOut'),
    category: [t('in-forge:plugins.ibmCloudEventStream.instance')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch(
      'members',
      'instance_topic_bytes_out_per_second',
      t('in-forge:plugins.ibmCloudEventStream.topic')
    ),
    label: t('in-forge:plugins.ibmCloudEventStream.topicBytesIn'),
    category: [t('in-forge:plugins.ibmCloudEventStream.instance')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch(
      'members',
      'instance_topic_bytes_in_per_second',
      t('in-forge:plugins.ibmCloudEventStream.topic')
    ),
    label: t('in-forge:plugins.ibmCloudEventStream.topicBytesOut'),
    category: [t('in-forge:plugins.ibmCloudEventStream.topic')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('members', 'instance_topics', t('in-forge:plugins.ibmCloudEventStream.instance')),
    label: t('in-forge:plugins.ibmCloudEventStream.instanceTopics'),
    category: [t('in-forge:plugins.ibmCloudEventStream.instance')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('members', 'instance_partitions', t('in-forge:plugins.ibmCloudEventStream.instance')),
    label: t('in-forge:plugins.ibmCloudEventStream.instancePartitions'),
    category: [t('in-forge:plugins.ibmCloudEventStream.instance')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch(
      'members',
      'kafka_recommended_max_connected_clients_percent',
      t('in-forge:plugins.ibmCloudEventStream.instance')
    ),
    label: t('in-forge:plugins.ibmCloudEventStream.kafkaRecommendedMaxConnectedClientsPercent'),
    category: [t('in-forge:plugins.ibmCloudEventStream.instance')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch(
      'members',
      'instance_inactive_consumergroups',
      t('in-forge:plugins.ibmCloudEventStream.instance')
    ),
    label: t('in-forge:plugins.ibmCloudEventStream.instanceInactiveConsumerGroups'),
    category: [t('in-forge:plugins.ibmCloudEventStream.instance')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch(
      'members',
      'instance_rebalancing_consumergroups',
      t('in-forge:plugins.ibmCloudEventStream.instance')
    ),
    label: t('in-forge:plugins.ibmCloudEventStream.instanceRebalancingConsumerGroups'),
    category: [t('in-forge:plugins.ibmCloudEventStream.instance')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch(
      'members',
      'instance_reserved_disk_space_percent',
      t('in-forge:plugins.ibmCloudEventStream.instance')
    ),
    label: t('in-forge:plugins.ibmCloudEventStream.instanceReservedDiskSpacePercent'),
    category: [t('in-forge:plugins.ibmCloudEventStream.instance')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch(
      'members',
      'instance_schema_registry_schema_versions_greatest_percentage',
      t('in-forge:plugins.ibmCloudEventStream.instance')
    ),
    label: t('in-forge:plugins.ibmCloudEventStream.instanceSchemaRegistrySchemaVersionsGreatestPercentage'),
    category: [t('in-forge:plugins.ibmCloudEventStream.instance')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch(
      'members',
      'instance_schema_registry_schemas_used_percentage',
      t('in-forge:plugins.ibmCloudEventStream.instance')
    ),
    label: t('in-forge:plugins.ibmCloudEventStream.instanceSchemaRegistrySchemasUsedPercentage'),
    category: [t('in-forge:plugins.ibmCloudEventStream.instance')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch(
      'members',
      'instance_stable_consumergroups',
      t('in-forge:plugins.ibmCloudEventStream.instance')
    ),
    label: t('in-forge:plugins.ibmCloudEventStream.instanceStableConsumerGroups'),
    category: [t('in-forge:plugins.ibmCloudEventStream.instance')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch(
      'members',
      'instance_utilised_disk_space_percent',
      t('in-forge:plugins.ibmCloudEventStream.instance')
    ),
    label: t('in-forge:plugins.ibmCloudEventStream.instanceUtilisedDiskSpacePercent'),
    category: [t('in-forge:plugins.ibmCloudEventStream.instance')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch(
      'members',
      'kafka_authentication_failure_total',
      t('in-forge:plugins.ibmCloudEventStream.enterprise')
    ),
    label: t('in-forge:plugins.ibmCloudEventStream.kafkaAuthenticationFailureTotal'),
    category: [t('in-forge:plugins.ibmCloudEventStream.enterprise')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch(
      'members',
      'kafka_missing_sni_host_total',
      t('in-forge:plugins.ibmCloudEventStream.enterprise')
    ),
    label: t('in-forge:plugins.ibmCloudEventStream.kafkaMissingSniHostTotal'),
    category: [t('in-forge:plugins.ibmCloudEventStream.enterprise')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch(
      'members',
      'instance_produce_conversions_time_quantile.5',
      t('in-forge:plugins.ibmCloudEventStream.instance')
    ),
    label: t('in-forge:plugins.ibmCloudEventStream.instance'),
    category: [t('in-forge:plugins.ibmCloudEventStream.quantile5')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch(
      'members',
      'instance_produce_conversions_time_quantile.75',
      t('in-forge:plugins.ibmCloudEventStream.instance')
    ),
    label: t('in-forge:plugins.ibmCloudEventStream.instance'),
    category: [t('in-forge:plugins.ibmCloudEventStream.quantile75')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch(
      'members',
      'instance_produce_conversions_time_quantile.95',
      t('in-forge:plugins.ibmCloudEventStream.instance')
    ),
    label: t('in-forge:plugins.ibmCloudEventStream.instance'),
    category: [t('in-forge:plugins.ibmCloudEventStream.quantile95')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch(
      'members',
      'instance_produce_conversions_time_quantile.98',
      t('in-forge:plugins.ibmCloudEventStream.instance')
    ),
    label: t('in-forge:plugins.ibmCloudEventStream.instance'),
    category: [t('in-forge:plugins.ibmCloudEventStream.quantile98')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch(
      'members',
      'instance_produce_conversions_time_quantile.99',
      t('in-forge:plugins.ibmCloudEventStream.instance')
    ),
    label: t('in-forge:plugins.ibmCloudEventStream.instance'),
    category: [t('in-forge:plugins.ibmCloudEventStream.quantile99')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch(
      'members',
      'instance_produce_conversions_time_quantile.999',
      t('in-forge:plugins.ibmCloudEventStream.instance')
    ),
    label: t('in-forge:plugins.ibmCloudEventStream.instance'),
    category: [t('in-forge:plugins.ibmCloudEventStream.quantile999')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch(
      'members',
      'instance_consume_conversions_time_quantile.5',
      t('in-forge:plugins.ibmCloudEventStream.instance')
    ),
    label: t('in-forge:plugins.ibmCloudEventStream.instance'),
    category: [t('in-forge:plugins.ibmCloudEventStream.quantile5')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch(
      'members',
      'instance_consume_conversions_time_quantile.75',
      t('in-forge:plugins.ibmCloudEventStream.instance')
    ),
    label: t('in-forge:plugins.ibmCloudEventStream.instance'),
    category: [t('in-forge:plugins.ibmCloudEventStream.quantile75')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch(
      'members',
      'instance_consume_conversions_time_quantile.95',
      t('in-forge:plugins.ibmCloudEventStream.instance')
    ),
    label: t('in-forge:plugins.ibmCloudEventStream.instance'),
    category: [t('in-forge:plugins.ibmCloudEventStream.quantile95')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch(
      'members',
      'instance_consume_conversions_time_quantile.98',
      t('in-forge:plugins.ibmCloudEventStream.instance')
    ),
    label: t('in-forge:plugins.ibmCloudEventStream.instance'),
    category: [t('in-forge:plugins.ibmCloudEventStream.quantile98')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch(
      'members',
      'instance_consume_conversions_time_quantile.99',
      t('in-forge:plugins.ibmCloudEventStream.instance')
    ),
    label: t('in-forge:plugins.ibmCloudEventStream.instance'),
    category: [t('in-forge:plugins.ibmCloudEventStream.quantile99')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch(
      'members',
      'instance_consume_conversions_time_quantile.999',
      t('in-forge:plugins.ibmCloudEventStream.instance')
    ),
    label: t('in-forge:plugins.ibmCloudEventStream.instance'),
    category: [t('in-forge:plugins.ibmCloudEventStream.quantile999')],
    min: 0,
    formatter: number
  }
];
