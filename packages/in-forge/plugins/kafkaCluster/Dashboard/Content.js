/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import ConsumerGroupsLagPerTopicTable from 'in-forge/plugins/kafkaCluster/Dashboard/ConsumerGroupsLagPerTopicTable';
import PartitionsPerNodeTable from 'in-forge/plugins/kafkaCluster/Dashboard/PartitionsPerNodeTable';
import { number, bytes, millis, percentageZeroDecimalPlaces } from 'in-services/formatters/number';
import createClusterClientsSubscription from 'in-subscription/kafkaCluster/getClientsForCluster';
import ProducersTable from 'in-forge/plugins/kafkaCluster/Dashboard/ProducersTable';
import ConsumersTable from 'in-forge/plugins/kafkaCluster/Dashboard/ConsumersTable';
import TopicsTable from 'in-forge/plugins/kafkaCluster/Dashboard/TopicsTable.js';
import NodesTable from 'in-forge/plugins/kafkaCluster/Dashboard/NodesTable.js';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import ClusterSummary from 'in-forge/plugins/kafkaCluster/ClusterSummary';
import { timeConfig$ } from 'in-stores/time/config';
import { getSnapshots } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

export default connectTo(
  props => ({
    clientSnapshots: timeConfig$
      .flatMap(timeConfig => createClusterClientsSubscription({ snapshotId: props.snapshot.get('id'), timeConfig }))
      .flatMap(getSnapshots)
  }),

  function KafkaClusterDashboard({ snapshot, clientSnapshots, timeConfig }) {
    return (
      <div>
        <ClusterSummary snapshot={snapshot} />

        <DashboardSection title={t('in-forge:plugins.kafkaCluster.averageRequestLatencyVsThroughput')}>
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              formatter: number.detailed,
              tooltipFormatter: number.detailed,
              metrics: ['broker.produceRequests', 'broker.fetchConsumerRequests', 'broker.fetchFollowerRequests'],
              labels: [
                t('in-forge:plugins.kafkaCluster.produceThroughput'),
                t('in-forge:plugins.kafkaCluster.fetchConsumerThroughput'),
                t('in-forge:plugins.kafkaCluster.fetchFollowerThroughput')
              ],
              type: 'line'
            }}
            y2={{
              formatter: millis.compact,
              tooltipFormatter: millis.detailed,
              metrics: ['broker.totalTimeProduce', 'broker.totalTimeFetchConsumer', 'broker.totalTimeFetchFollower'],
              labels: [
                t('in-forge:plugins.kafkaCluster.produceLatency'),
                t('in-forge:plugins.kafkaCluster.fetchConsumerLatency'),
                t('in-forge:plugins.kafkaCluster.fetchFollowerLatency')
              ],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.kafkaCluster.allBrokersTraffic')}>
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              formatter: bytes.detailed,
              tooltipFormatter: bytes.detailed,
              metrics: ['broker.bytesIn', 'broker.bytesOut', 'broker.bytesRejected'],
              labels: [
                t('in-forge:plugins.kafkaCluster.in'),
                t('in-forge:plugins.kafkaCluster.out'),
                t('in-forge:plugins.kafkaCluster.rejected')
              ],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.kafkaCluster.allBrokersMessagesIn')}>
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              formatter: number.compact,
              tooltipFormatter: number.compact,
              metrics: ['broker.messagesIn'],
              labels: [t('in-forge:plugins.kafkaCluster.count')],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.kafkaCluster.allBrokersFailures')}>
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              formatter: number.compact,
              tooltipFormatter: number.compact,
              metrics: ['broker.failedFetch', 'broker.failedProduce'],
              labels: [t('in-forge:plugins.kafkaCluster.fetch'), t('in-forge:plugins.kafkaCluster.produce')],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.kafkaCluster.allBrokersStateMetrics')}>
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              formatter: number.compact,
              tooltipFormatter: number.compact,
              metrics: [
                'broker.underReplicatedPartitions',
                'broker.offlinePartitionsCount',
                'broker.leaderElections',
                'broker.uncleanLeaderElections',
                'broker.isrShrinks',
                'broker.isrExpansions',
                'broker.activeControllerCount'
              ],
              labels: [
                t('in-forge:plugins.kafka.underReplicatedPartitions'),
                t('in-forge:plugins.kafka.offlinePartitions'),
                t('in-forge:plugins.kafka.leaderElections'),
                t('in-forge:plugins.kafka.uncleanLeaderElections'),
                t('in-forge:plugins.kafka.isrShrinks'),
                t('in-forge:plugins.kafka.isrExpansions'),
                t('in-forge:plugins.kafka.activeControllerCount')
              ],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.kafkaCluster.averageIdleTimePercentage')}>
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              formatter: percentageZeroDecimalPlaces,
              tooltipFormatter: percentageZeroDecimalPlaces,
              metrics: ['broker.networkProcessorIdle', 'broker.requestHandlerIdle'],
              labels: [
                t('in-forge:plugins.kafkaCluster.networkProcessor'),
                t('in-forge:plugins.kafkaCluster.requestHandler')
              ],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.kafkaCluster.logFlushing')}>
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              formatter: millis.detailed,
              tooltipFormatter: millis.detailed,
              metrics: ['logflush.mean'],
              labels: [t('in-forge:plugins.kafkaCluster.mean')],
              type: 'line'
            }}
            y2={{
              formatter: number.detailed,
              tooltipFormatter: number.detailed,
              metrics: ['logflush.inv'],
              labels: [t('in-forge:plugins.kafkaCluster.flushes')],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>

        <NodesTable clusterSnapshotId={snapshot.get('id')} timeConfig={timeConfig} />
        <PartitionsPerNodeTable clusterSnapshotId={snapshot.get('id')} timeConfig={timeConfig} />

        <TopicsTable snapshot={snapshot} timeConfig={timeConfig} />
        <ConsumerGroupsLagPerTopicTable snapshot={snapshot} timeConfig={timeConfig} />

        {clientSnapshots && <ProducersTable clientSnapshots={clientSnapshots} timeConfig={timeConfig} />}
        {clientSnapshots && <ConsumersTable clientSnapshots={clientSnapshots} timeConfig={timeConfig} />}
      </div>
    );
  }
);
