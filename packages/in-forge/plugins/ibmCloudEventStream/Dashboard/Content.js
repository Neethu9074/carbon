/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import TopicsTable from 'in-forge/plugins/ibmCloudEventStream/Dashboard/TopicsTable';
import { bytes, number, percentage, millis } from 'in-services/formatters/number';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import Columize from 'in-sdk/components/dashboard/Columize';
import { t } from 'in-i18n';

export default function IbmEventStreamDashboard({ snapshot, timeConfig }) {
  return (
    <div>
      <DashboardSection title={t('in-forge:plugins.ibmCloudEventStream.instanceBytes')}>
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: bytes.compact,
            metrics: ['instance_bytes_in_per_second', 'instance_bytes_out_per_second'],
            labels: [t('in-forge:plugins.ibmCloudEventStream.in'), t('in-forge:plugins.ibmCloudEventStream.out')],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <TopicsTable snapshot={snapshot} timeConfig={timeConfig} />

      <Columize>
        <DashboardSection title={t('in-forge:plugins.ibmCloudEventStream.diskSpace')}>
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: percentage,
              metrics: ['instance_reserved_disk_space_percent', 'instance_utilised_disk_space_percent'],
              labels: [
                t('in-forge:plugins.ibmCloudEventStream.reserved'),
                t('in-forge:plugins.ibmCloudEventStream.utilized')
              ],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.ibmCloudEventStream.instanceTopics')}>
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: number,
              metrics: ['instance_topics'],
              labels: [t('in-forge:plugins.ibmCloudEventStream.count')],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.ibmCloudEventStream.instancePartitions')}>
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: number,
              metrics: ['instance_partitions'],
              labels: [t('in-forge:plugins.ibmCloudEventStream.count')],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.ibmCloudEventStream.instanceStableConsumerGroups')}>
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: number,
              metrics: ['instance_stable_consumergroups'],
              labels: [t('in-forge:plugins.ibmCloudEventStream.count')],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.ibmCloudEventStream.instanceInactiveConsumerGroups')}>
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: number,
              metrics: ['instance_inactive_consumergroups'],
              labels: [t('in-forge:plugins.ibmCloudEventStream.count')],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.ibmCloudEventStream.instanceRebalancingConsumerGroups')}>
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: number,
              metrics: ['instance_rebalancing_consumergroups'],
              labels: [t('in-forge:plugins.ibmCloudEventStream.count')],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.ibmCloudEventStream.kafkaRecommendedMaxConnectedClientsPercent')}>
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: percentage,
              metrics: ['kafka_authentication_failure_total'],
              labels: [t('in-forge:plugins.ibmCloudEventStream.count')],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.ibmCloudEventStream.kafkaAuthenticationFailureTotal')}>
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: number,
              metrics: ['kafka_authentication_failure_total'],
              labels: [t('in-forge:plugins.ibmCloudEventStream.count')],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.ibmCloudEventStream.kafkaMissingSniHostTotal')}>
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: number,
              metrics: ['kafka_missing_sni_host_total'],
              labels: [t('in-forge:plugins.ibmCloudEventStream.count')],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.ibmCloudEventStream.instanceProduceConversionsTimeQuantile')}>
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: millis.compact,
              metrics: [
                'instance_produce_conversions_time_quantile.5',
                'instance_produce_conversions_time_quantile.75',
                'instance_produce_conversions_time_quantile.95',
                'instance_produce_conversions_time_quantile.98',
                'instance_produce_conversions_time_quantile.99',
                'instance_produce_conversions_time_quantile.999'
              ],
              labels: [
                t('in-forge:plugins.ibmCloudEventStream.quantile5'),
                t('in-forge:plugins.ibmCloudEventStream.quantile75'),
                t('in-forge:plugins.ibmCloudEventStream.quantile95'),
                t('in-forge:plugins.ibmCloudEventStream.quantile98'),
                t('in-forge:plugins.ibmCloudEventStream.quantile99'),
                t('in-forge:plugins.ibmCloudEventStream.quantile999')
              ],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>

        <DashboardSection title={t('in-forge:plugins.ibmCloudEventStream.instanceConsumeConversionsTimeQuantile')}>
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: millis.compact,
              metrics: [
                'instance_consume_conversions_time_quantile.5',
                'instance_consume_conversions_time_quantile.75',
                'instance_consume_conversions_time_quantile.95',
                'instance_consume_conversions_time_quantile.98',
                'instance_consume_conversions_time_quantile.99',
                'instance_consume_conversions_time_quantile.999'
              ],
              labels: [
                t('in-forge:plugins.ibmCloudEventStream.quantile5'),
                t('in-forge:plugins.ibmCloudEventStream.quantile75'),
                t('in-forge:plugins.ibmCloudEventStream.quantile95'),
                t('in-forge:plugins.ibmCloudEventStream.quantile98'),
                t('in-forge:plugins.ibmCloudEventStream.quantile99'),
                t('in-forge:plugins.ibmCloudEventStream.quantile999')
              ],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.ibmCloudEventStream.schemaRegistry')}>
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: percentage,
              metrics: ['instance_schema_registry_schema_versions_greatest_percentage'],
              labels: [
                t('in-forge:plugins.ibmCloudEventStream.instanceSchemaRegistrySchemaVersionsGreatestPercentage')
              ],
              type: 'line'
            }}
            y2={{
              min: 0,
              formatter: percentage,
              metrics: ['instance_schema_registry_schemas_used_percentage'],
              labels: [t('in-forge:plugins.ibmCloudEventStream.instanceSchemaRegistrySchemasUsedPercentage')],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
    </div>
  );
}
