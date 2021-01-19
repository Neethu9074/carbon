/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { number, bytes, millis, percentageZeroDecimalPlaces } from 'in-services/formatters/number';
import ConsumerGroupsLagPerTopicTable from 'in-forge/plugins/kafkaCluster/Dashboard/ConsumerGroupsLagPerTopicTable';
import PartitionsPerNodeTable from 'in-forge/plugins/kafkaCluster/Dashboard/PartitionsPerNodeTable';
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

        <DashboardSection title="Average Request Latency vs Throughput">
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              formatter: number.detailed,
              tooltipFormatter: number.detailed,
              metrics: ['broker.produceRequests', 'broker.fetchConsumerRequests', 'broker.fetchFollowerRequests'],
              labels: ['Produce Throughput', 'Fetch Consumer Throughput', 'Fetch Follower Throughput'],
              type: 'line'
            }}
            y2={{
              formatter: millis.compact,
              tooltipFormatter: millis.detailed,
              metrics: ['broker.totalTimeProduce', 'broker.totalTimeFetchConsumer', 'broker.totalTimeFetchFollower'],
              labels: ['Produce Latency', 'Fetch Consumer Latency', 'Fetch Follower Latency'],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title="All Brokers Traffic">
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              formatter: bytes.detailed,
              tooltipFormatter: bytes.detailed,
              metrics: ['broker.bytesIn', 'broker.bytesOut', 'broker.bytesRejected'],
              labels: ['In', 'Out', 'Rejected'],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title="All Brokers Messages In">
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              formatter: number.compact,
              tooltipFormatter: number.compact,
              metrics: ['broker.messagesIn'],
              labels: ['Count'],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title="All Brokers Failures">
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              formatter: number.compact,
              tooltipFormatter: number.compact,
              metrics: ['broker.failedFetch', 'broker.failedProduce'],
              labels: ['Fetch', 'Produce'],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title="All Brokers state metrics">
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
                'Under-replicated Partitions',
                'Offline Partitions',
                'Leader Elections',
                'Unclean Leader Elections',
                'ISR Shrinks',
                'ISR Expansions',
                'Active controller count'
              ],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title="Average Idle Time Percentage">
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              formatter: percentageZeroDecimalPlaces,
              tooltipFormatter: percentageZeroDecimalPlaces,
              metrics: ['broker.networkProcessorIdle', 'broker.requestHandlerIdle'],
              labels: ['Network Processor', 'Request Handler'],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title="Log Flushing">
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              formatter: millis.detailed,
              tooltipFormatter: millis.detailed,
              metrics: ['logflush.mean'],
              labels: ['Mean'],
              type: 'line'
            }}
            y2={{
              formatter: number.detailed,
              tooltipFormatter: number.detailed,
              metrics: ['logflush.inv'],
              labels: ['Flushes'],
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
