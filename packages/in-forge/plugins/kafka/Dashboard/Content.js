/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
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
        <KpiKeyValue label={t('in-forge:plugins.kafka.produceLatency')}>
          <MetricValue snapshotId={snapshotId} metric="broker.totalTimeProduce" formatter={millis.compact} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.kafka.fetchConsumerLatency')}>
          <MetricValue snapshotId={snapshotId} metric="broker.totalTimeFetchConsumer" formatter={millis.compact} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.kafka.fetchFollowerLatency')}>
          <MetricValue snapshotId={snapshotId} metric="broker.totalTimeFetchFollower" formatter={millis.compact} />
        </KpiKeyValue>
      </KpiSection>

      <Columize>
        <DashboardSection title={t('in-forge:plugins.kafka.brokerTraffic')}>
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              formatter: bytes.compact,
              tooltipFormatter: bytes.detailed,
              metrics: ['broker.bytesIn', 'broker.bytesOut', 'broker.bytesRejected'],
              labels: [
                t('in-forge:plugins.kafka.in'),
                t('in-forge:plugins.kafka.out'),
                t('in-forge:plugins.kafka.rejected')
              ],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>

        <DashboardSection title={t('in-forge:plugins.kafka.brokerMessagesIn')}>
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              formatter: number.compact,
              tooltipFormatter: number.detailed,
              metrics: ['broker.messagesIn'],
              labels: [t('in-forge:plugins.kafka.count')],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>

      <Columize>
        <DashboardSection title={t('in-forge:plugins.kafka.produceRequests')}>
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              formatter: number.compact,
              tooltipFormatter: number.detailed,
              metrics: ['broker.produceRequests'],
              labels: [t('in-forge:plugins.kafka.count')],
              type: 'line'
            }}
            y2={{
              formatter: millis.compact,
              tooltipFormatter: millis.detailed,
              metrics: ['broker.produceLatency'],
              labels: [t('in-forge:plugins.kafka.meanLatency')],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>

        <DashboardSection title={t('in-forge:plugins.kafka.fetchConsumerRequests')}>
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              formatter: number.compact,
              tooltipFormatter: number.detailed,
              metrics: ['broker.fetchConsumerRequests'],
              labels: [t('in-forge:plugins.kafka.count')],
              type: 'line'
            }}
            y2={{
              formatter: millis.compact,
              tooltipFormatter: millis.detailed,
              metrics: ['broker.fetchLatency'],
              labels: [t('in-forge:plugins.kafka.meanLatency')],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>

        <DashboardSection title={t('in-forge:plugins.kafka.fetchFollowerRequests')}>
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              formatter: number.compact,
              tooltipFormatter: number.detailed,
              metrics: ['broker.fetchFollowerRequests'],
              labels: [t('in-forge:plugins.kafka.count')],
              type: 'line'
            }}
            y2={{
              formatter: millis.compact,
              tooltipFormatter: millis.detailed,
              metrics: ['broker.fetchFollowerLatency'],
              labels: [t('in-forge:plugins.kafka.meanLatency')],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>

      <DashboardSection title={t('in-forge:plugins.kafka.averageIdleTime')}>
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            formatter: percentageZeroDecimalPlaces,
            tooltipFormatter: percentageZeroDecimalPlaces,
            metrics: ['broker.networkProcessorIdle', 'broker.requestHandlerIdle'],
            labels: [t('in-forge:plugins.kafka.networkProcessor'), t('in-forge:plugins.kafka.requestHandler')],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.kafka.brokerFailures')}>
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            formatter: number.compact,
            tooltipFormatter: number.detailed,
            metrics: ['broker.failedFetch', 'broker.failedProduce'],
            labels: [t('in-forge:plugins.kafka.fetch'), t('in-forge:plugins.kafka.produce')],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.kafka.brokerStateMetrics')}>
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

      <DashboardSection title={t('in-forge:plugins.kafka.partitions')}>
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            formatter: number.compact,
            tooltipFormatter: number.compact,
            metrics: ['broker.partitionCount'],
            labels: [t('in-forge:plugins.kafka.count')],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.kafka.logFlushing')}>
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            formatter: millis.detailed,
            tooltipFormatter: millis.detailed,
            metrics: ['logflush.mean'],
            labels: [t('in-forge:plugins.kafka.mean')],
            type: 'line'
          }}
          y2={{
            formatter: number.detailed,
            tooltipFormatter: number.detailed,
            metrics: ['logflush.inv'],
            labels: [t('in-forge:plugins.kafka.flushes')],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <TopicsTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}
