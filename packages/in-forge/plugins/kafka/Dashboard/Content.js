/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { number, bytes, millis, percentageZeroDecimalPlaces } from 'in-services/formatters/number';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import TopicsTable from 'in-forge/plugins/kafka/Dashboard/TopicsTable';
import Columize from 'in-sdk/components/dashboard/Columize';
import MetricValue from 'in-components/MetricValue';

export default function KafkaDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <KpiSection>
        <KpiKeyValue label="Produce Latency">
          <MetricValue snapshotId={snapshotId} metric="broker.totalTimeProduce" formatter={millis.compact} />
        </KpiKeyValue>
        <KpiKeyValue label="Fetch Consumer Latency">
          <MetricValue snapshotId={snapshotId} metric="broker.totalTimeFetchConsumer" formatter={millis.compact} />
        </KpiKeyValue>
        <KpiKeyValue label="Fetch Follower Latency">
          <MetricValue snapshotId={snapshotId} metric="broker.totalTimeFetchFollower" formatter={millis.compact} />
        </KpiKeyValue>
      </KpiSection>

      <Columize>
        <DashboardSection title="Broker Traffic">
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              formatter: bytes.compact,
              tooltipFormatter: bytes.detailed,
              metrics: ['broker.bytesIn', 'broker.bytesOut', 'broker.bytesRejected'],
              labels: ['In', 'Out', 'Rejected'],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>

        <DashboardSection title="Broker Messages In">
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              formatter: number.compact,
              tooltipFormatter: number.detailed,
              metrics: ['broker.messagesIn'],
              labels: ['Count'],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>

      <Columize>
        <DashboardSection title="Produce Requests">
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              formatter: number.compact,
              tooltipFormatter: number.detailed,
              metrics: ['broker.produceRequests'],
              labels: ['Count'],
              type: 'line'
            }}
            y2={{
              formatter: millis.compact,
              tooltipFormatter: millis.detailed,
              metrics: ['broker.produceLatency'],
              labels: ['Mean Latency'],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>

        <DashboardSection title="Fetch Consumer Requests">
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              formatter: number.compact,
              tooltipFormatter: number.detailed,
              metrics: ['broker.fetchConsumerRequests'],
              labels: ['Count'],
              type: 'line'
            }}
            y2={{
              formatter: millis.compact,
              tooltipFormatter: millis.detailed,
              metrics: ['broker.fetchLatency'],
              labels: ['Mean Latency'],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>

        <DashboardSection title="Fetch Follower Requests">
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              formatter: number.compact,
              tooltipFormatter: number.detailed,
              metrics: ['broker.fetchFollowerRequests'],
              labels: ['Count'],
              type: 'line'
            }}
            y2={{
              formatter: millis.compact,
              tooltipFormatter: millis.detailed,
              metrics: ['broker.fetchFollowerLatency'],
              labels: ['Mean Latency'],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>

      <DashboardSection title="Average Idle Time">
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

      <DashboardSection title="Broker Failures">
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            formatter: number.compact,
            tooltipFormatter: number.detailed,
            metrics: ['broker.failedFetch', 'broker.failedProduce'],
            labels: ['Fetch', 'Produce'],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title="Broker State Metrics">
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

      <DashboardSection title="Partitions">
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            formatter: number.compact,
            tooltipFormatter: number.compact,
            metrics: ['broker.partitionCount'],
            labels: ['Count'],
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

      <TopicsTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}
