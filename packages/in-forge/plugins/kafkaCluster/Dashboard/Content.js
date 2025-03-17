/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import ConsumerGroupsLagPerTopicTable from 'in-forge/plugins/kafkaCluster/Dashboard/ConsumerGroupsLagPerTopicTable';
import createClusterClientsSubscription from 'in-forge/plugins/kafkaCluster/subscriptions/getClientsForCluster';
import PartitionsPerNodeTable from 'in-forge/plugins/kafkaCluster/Dashboard/PartitionsPerNodeTable';
import { number, bytes, millis, percentageZeroDecimalPlaces } from 'in-services/formatters/number';
import ProducersTable from 'in-forge/plugins/kafkaCluster/Dashboard/ProducersTable';
import ConsumersTable from 'in-forge/plugins/kafkaCluster/Dashboard/ConsumersTable';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import TopicsTable from 'in-forge/plugins/kafkaCluster/Dashboard/TopicsTable.js';
import NodesTable from 'in-forge/plugins/kafkaCluster/Dashboard/NodesTable.js';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ClusterSummary from 'in-forge/plugins/kafkaCluster/ClusterSummary';
import ExpandableCard from 'in-components/ExpandableCard';
import { timeConfig$ } from 'in-stores/time/config';
import { getSnapshots } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

export default function KafkaClusterDashboard({ snapshot, timeConfig }) {
  return (
    <div>
      <ClusterSummary snapshot={snapshot} />

      <DashboardSection title={t('in-forge:plugins.kafkaCluster.totalRequestTimeVsThroughput')}>
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            formatter: number.detailed,
            tooltipFormatter: number.detailed,
            metrics: ['broker.produceRequ ests', 'broker.fetchConsumerRequests', 'broker.fetchFollowerRequests'],
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
              t('in-forge:plugins.kafkaCluster.totalProduceTime'),
              t('in-forge:plugins.kafkaCluster.totalFetchConsumerTime'),
              t('in-forge:plugins.kafkaCluster.totalFetchFollowerTime')
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

      <ExpandableClientMetrics snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}

/**
 * Expandable wrapper around Kafka client metrics to enforce lazy loading to ensure this table is not blocking
 * the remaining UI, which can be expensive to load on large deployments with many Kafka consumers.
 * This is needed, because on large Kafka deployments, such as our own InstanaOps, the UI might attempt to load
 * tens of thousands of client metrics, which can lead to starving subscriptions, empty dashboards, and crashing UIs.
 */
const ExpandableClientMetrics = connectTo(
  ({ snapshot }) => ({
    clientSnapshots: timeConfig$
      .flatMap(timeConfig => createClusterClientsSubscription({ snapshotId: snapshot.get('id'), timeConfig }))
      // FIXME As a workaround to ensure the tables are not causing a memory leak and the UI to crash,
      //       we limit the number of client subscriptions to an arbitrary number, where 100 can still yield thousands
      //       of individual clients in each table. To fully resolve this, either server-side pagination should be used
      //       in the table, or the rows of the table need to be resolved lazily. So that getSnapshots is not called
      //       for each of the items.
      //       As a current trade-off of this workaround, the list might not be complete. But with tens of thousands of rows,
      //       that is rarely relevant, especially when they are not usable due to a frozen UI.
      .map(clientSubscriptions => clientSubscriptions.slice(0, 100))
      .flatMap(getSnapshots)
  }),
  function ProducersAndConsumersTables({ timeConfig, clientSnapshots }) {
    if (!clientSnapshots) {
      return null;
    }

    return (
      <ExpandableCard title={t('in-forge:plugins.kafkaCluster.clientMetrics')}>
        <ProducersTable clientSnapshots={clientSnapshots} timeConfig={timeConfig} />
        <ConsumersTable clientSnapshots={clientSnapshots} timeConfig={timeConfig} />
      </ExpandableCard>
    );
  }
);
