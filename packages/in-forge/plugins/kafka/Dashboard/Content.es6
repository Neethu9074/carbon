import React from 'react';

import {
  zeroDecimalPlaces,
  twoDecimalPlaces,
  bytesZeroDecimalPlaces,
  bytesTwoDecimalPlaces,
  msZeroDecimalPlaces,
  msTwoDecimalPlaces,
  percentageZeroDecimalPlaces
} from 'in-services/formatters/number';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
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
          <MetricValue snapshotId={snapshotId} metric="broker.totalTimeProduce" formatter={msZeroDecimalPlaces} />
        </KpiKeyValue>
        <KpiKeyValue label="Fetch Consumer Latency">
          <MetricValue snapshotId={snapshotId} metric="broker.totalTimeFetchConsumer" formatter={msZeroDecimalPlaces} />
        </KpiKeyValue>
        <KpiKeyValue label="Fetch Follower Latency">
          <MetricValue snapshotId={snapshotId} metric="broker.totalTimeFetchFollower" formatter={msZeroDecimalPlaces} />
        </KpiKeyValue>
      </KpiSection>

      <Columize>
        <DashboardSection title="Broker Traffic">
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              formatter: bytesZeroDecimalPlaces,
              tooltipFormatter: bytesTwoDecimalPlaces,
              metrics: ['broker.bytesIn', 'broker.bytesOut', 'broker.bytesRejected'],
              labels: ['In', 'Out', 'Rejected'],
              type: 'line'
            }}
          />
        </DashboardSection>

        <DashboardSection title="Broker Messages In">
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              formatter: zeroDecimalPlaces,
              tooltipFormatter: twoDecimalPlaces,
              metrics: ['broker.messagesIn'],
              labels: ['#'],
              type: 'line'
            }}
          />
        </DashboardSection>
      </Columize>

      <Columize>
        <DashboardSection title="Produce Requests">
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              formatter: zeroDecimalPlaces,
              tooltipFormatter: twoDecimalPlaces,
              metrics: ['broker.produceRequests'],
              labels: ['Count'],
              type: 'line'
            }}
            y2={{
              formatter: msZeroDecimalPlaces,
              tooltipFormatter: msTwoDecimalPlaces,
              metrics: ['broker.produceLatency'],
              labels: ['Mean Latency'],
              type: 'line'
            }}
          />
        </DashboardSection>

        <DashboardSection title="Fetch Consumer Requests">
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              formatter: zeroDecimalPlaces,
              tooltipFormatter: twoDecimalPlaces,
              metrics: ['broker.fetchConsumerRequests'],
              labels: ['Count'],
              type: 'line'
            }}
            y2={{
              formatter: msZeroDecimalPlaces,
              tooltipFormatter: msTwoDecimalPlaces,
              metrics: ['broker.fetchLatency'],
              labels: ['Mean Latency'],
              type: 'line'
            }}
          />
        </DashboardSection>

        <DashboardSection title="Fetch Follower Requests">
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              formatter: zeroDecimalPlaces,
              tooltipFormatter: twoDecimalPlaces,
              metrics: ['broker.fetchFollowerRequests'],
              labels: ['Count'],
              type: 'line'
            }}
            y2={{
              formatter: msZeroDecimalPlaces,
              tooltipFormatter: msTwoDecimalPlaces,
              metrics: ['broker.fetchFollowerLatency'],
              labels: ['Mean Latency'],
              type: 'line'
            }}
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
        />
      </DashboardSection>

      <DashboardSection title="Broker Failures">
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            formatter: zeroDecimalPlaces,
            tooltipFormatter: twoDecimalPlaces,
            metrics: ['broker.failedFetch', 'broker.failedProduce'],
            labels: ['Fetch', 'Produce'],
            type: 'line'
          }}
        />
      </DashboardSection>

      <DashboardSection title="Broker State Metrics">
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            formatter: zeroDecimalPlaces,
            tooltipFormatter: zeroDecimalPlaces,
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
        />
      </DashboardSection>

      <DashboardSection title="Partitions">
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            formatter: zeroDecimalPlaces,
            tooltipFormatter: zeroDecimalPlaces,
            metrics: ['broker.partitionCount'],
            labels: ['Count'],
            type: 'line'
          }}
        />
      </DashboardSection>

      <DashboardSection title="Log Flushing">
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            formatter: msTwoDecimalPlaces,
            tooltipFormatter: msTwoDecimalPlaces,
            metrics: ['logflush.mean'],
            labels: ['Mean'],
            type: 'line'
          }}
          y2={{
            formatter: msTwoDecimalPlaces,
            tooltipFormatter: msTwoDecimalPlaces,
            metrics: ['logflush.inv'],
            labels: ['Flushes'],
            type: 'line'
          }}
        />
      </DashboardSection>

      <TopicsTable snapshot={snapshot} />
    </div>
  );
}
