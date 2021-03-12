/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import { number, bytes, millis, seconds } from 'in-services/formatters/number';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { yesOrNo } from 'in-services/formatters/boolean';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

export default function BeeInstanaDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  const label = snapshot.getIn(['data', 'label']);

  if (label === 'ingestor') {
    return (
      <div>
        <KpiSection>
          <KpiKeyValue label={t('in-forge:plugins.beeInstana.dashboard.labelMetrics')}>
            <MetricValue
              snapshotId={snapshotId}
              metric="Ingestor.AggregatorFlushByTimeAndPartition.NumOfMetrics.sum"
              formatter={number.compact}
            />
          </KpiKeyValue>
          <KpiKeyValue label={t('in-forge:plugins.beeInstana.dashboard.labelMessages')}>
            <MetricValue
              snapshotId={snapshotId}
              metric="Ingestor.KafkaConsumer.MessageDelay.count"
              formatter={number.compact}
            />
          </KpiKeyValue>
          <KpiKeyValue label={t('in-forge:plugins.beeInstana.dashboard.labelErrors')}>
            <MetricValue snapshotId={snapshotId} metric="Ingestor.KafkaConsumer.Error.sum" formatter={number.compact} />
          </KpiKeyValue>
          <KpiKeyValue label={t('in-forge:plugins.beeInstana.dashboard.labelSpillOver')}>
            <MetricValue
              snapshotId={snapshotId}
              metric="Ingestor.KafkaConsumer.SpillOver.sum"
              formatter={bytes.compact}
            />
          </KpiKeyValue>
        </KpiSection>

        <DashboardSection title={t('in-forge:plugins.beeInstana.dashboard.titleMetrics')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['Ingestor.AggregatorFlushByTimeAndPartition.NumOfMetrics.sum'],
              labels: [t('in-forge:plugins.beeInstana.dashboard.labelCount')],
              type: 'line',
              formatter: number.detailed
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>

        <DashboardSection title={t('in-forge:plugins.beeInstana.dashboard.titleKafka')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: [
                'Ingestor.KafkaConsumer.NumOfMetrics.sum',
                'Ingestor.KafkaConsumer.NumOfDataPoints.sum',
                'Ingestor.KafkaConsumer.MessageDelay.count',
                'Ingestor.KafkaConsumer.Error.sum'
              ],
              labels: [
                t('in-forge:plugins.beeInstana.dashboard.labelMetricCount'),
                t('in-forge:plugins.beeInstana.dashboard.labelDatapointCount'),
                t('in-forge:plugins.beeInstana.dashboard.labelMessageCount'),
                t('in-forge:plugins.beeInstana.dashboard.labelMessageErrorCount')
              ],
              type: 'line',
              formatter: number.compact
            }}
            y2={{
              min: 0,
              metrics: ['Ingestor.KafkaConsumer.MessageDelay.max'],
              labels: [t('in-forge:plugins.beeInstana.dashboard.labelMessageDelay')],
              type: 'line',
              formatter: millis.compact
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>

        <DashboardSection title={t('in-forge:plugins.beeInstana.dashboard.titleQueueAndWorker')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: [
                'Ingestor.Configuration.MaxQueueSize.max',
                'Ingestor.KafkaConsumer.TaskQueueSize.max',
                'Ingestor.KafkaConsumer.SpillOver.sum',
                'Ingestor.Configuration.WorkerPoolSize.max'
              ],
              labels: [
                t('in-forge:plugins.beeInstana.dashboard.labelMaxQueueSize'),
                t('in-forge:plugins.beeInstana.dashboard.labelTaskQueueSize'),
                t('in-forge:plugins.beeInstana.dashboard.labelSpillOver'),
                t('in-forge:plugins.beeInstana.dashboard.labelWorkerPoolSize')
              ],
              type: 'line',
              formatter: number.detailed
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>

        <DashboardSection title={t('in-forge:plugins.beeInstana.dashboard.titleFlush')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['Ingestor.AggregatorFlushByTimeAndPartition.Duration.max'],
              labels: [t('in-forge:plugins.beeInstana.dashboard.labelDuration')],
              type: 'line',
              formatter: seconds.detailed
            }}
            y2={{
              min: 0,
              metrics: ['Ingestor.AggregatorFlushByTimeAndPartition.Duration.count'],
              labels: [t('in-forge:plugins.beeInstana.dashboard.labelCount')],
              type: 'line',
              formatter: number.compact
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>

        <DashboardSection title={t('in-forge:plugins.beeInstana.dashboard.titleSender')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['Ingestor.HttpSender.SucceededBytes.sum', 'Ingestor.HttpSender.FailedBytes.sum'],
              labels: [
                t('in-forge:plugins.beeInstana.dashboard.labelsSucceededBytes'),
                t('in-forge:plugins.beeInstana.dashboard.labelFailedBytes')
              ],
              type: 'line',
              formatter: bytes.compact
            }}
            y2={{
              min: 0,
              metrics: ['Ingestor.HttpSender.SucceededBytes.count', 'Ingestor.HttpSender.FailedBytes.count'],
              labels: [
                t('in-forge:plugins.beeInstana.dashboard.labelSucceededCount'),
                t('in-forge:plugins.beeInstana.dashboard.labelFailedCount')
              ],
              type: 'line',
              formatter: number.compact
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </div>
    );
  } else {
    return (
      <div>
        <KpiSection>
          <KpiKeyValue label={t('in-forge:plugins.beeInstana.dashboard.labelMetrics')}>
            <MetricValue
              snapshotId={snapshotId}
              metric="Aggregator.AggregatorStats.NumMetricsWithData.max"
              formatter={number.compact}
            />
          </KpiKeyValue>
          <KpiKeyValue label={t('in-forge:plugins.beeInstana.dashboard.labelReady')}>
            <MetricValue snapshotId={snapshotId} metric="Aggregator.Status.Ready.max" formatter={yesOrNo} />
          </KpiKeyValue>
          <KpiKeyValue label={t('in-forge:plugins.beeInstana.dashboard.labelAggregateDatasize')}>
            <MetricValue
              snapshotId={snapshotId}
              metric="Aggregator.AggregateBinary.DataSize.max"
              formatter={bytes.compact}
            />
          </KpiKeyValue>
          <KpiKeyValue label={t('in-forge:plugins.beeInstana.dashboard.labelThrottledAccounts')}>
            <MetricValue
              snapshotId={snapshotId}
              metric="Aggregator.AggregatorStats.NumThrottledAccounts.max"
              formatter={number.compact}
            />
          </KpiKeyValue>
        </KpiSection>

        <DashboardSection title={t('in-forge:plugins.beeInstana.dashboard.titleMetrics')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['Aggregator.AggregatorStats.NumMetricsWithData.max'],
              labels: [t('in-forge:plugins.beeInstana.dashboard.labelCount')],
              type: 'line',
              formatter: number.detailed
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>

        <DashboardSection title={t('in-forge:plugins.beeInstana.dashboard.titleQueue')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['Aggregator.AggregateBinary.SpillOver.sum', 'Aggregator.AggregatorStats.TaskQueueSize.max'],
              labels: [
                t('in-forge:plugins.beeInstana.dashboard.labelSpillOver'),
                t('in-forge:plugins.beeInstana.dashboard.labelTaskQueueSize')
              ],
              type: 'line',
              formatter: number.detailed
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>

        <DashboardSection title={t('in-forge:plugins.beeInstana.dashboard.titleGetMetricsAPI')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['Aggregator.GetMetrics.Timing.max', 'Aggregator.GetMetrics.Timing.min'],
              labels: [
                t('in-forge:plugins.beeInstana.dashboard.labelMaxLatency'),
                t('in-forge:plugins.beeInstana.dashboard.labelMinLatency')
              ],
              type: 'line',
              formatter: millis.compact
            }}
            y2={{
              min: 0,
              metrics: ['Aggregator.GetMetrics.Timing.count'],
              labels: [t('in-forge:plugins.beeInstana.dashboard.labelRequestCount')],
              type: 'line',
              formatter: number.compact
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>

        <DashboardSection title={t('in-forge:plugins.beeInstana.dashboard.titleGetMetricDataAPI')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['Aggregator.GetMetricData.Timing.max', 'Aggregator.GetMetricData.Timing.min'],
              labels: [
                t('in-forge:plugins.beeInstana.dashboard.labelMaxLatency'),
                t('in-forge:plugins.beeInstana.dashboard.labelMinLatency')
              ],
              type: 'line',
              formatter: millis.compact
            }}
            y2={{
              min: 0,
              metrics: ['Aggregator.GetMetricData.Timing.count'],
              labels: [t('in-forge:plugins.beeInstana.dashboard.labelRequestCount')],
              type: 'line',
              formatter: number.compact
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>

        <DashboardSection title={t('in-forge:plugins.beeInstana.dashboard.titleMetricPruningDurations')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: [
                'Aggregator.AggregatorPrune.period10.Duration.max',
                'Aggregator.AggregatorPrune.period60.Duration.max',
                'Aggregator.AggregatorPrune.period300.Duration.max',
                'Aggregator.AggregatorPrune.period3600.Duration.max'
              ],
              labels: [
                t('in-forge:plugins.beeInstana.dashboard.label10s'),
                t('in-forge:plugins.beeInstana.dashboard.label1m'),
                t('in-forge:plugins.beeInstana.dashboard.label5m'),
                t('in-forge:plugins.beeInstana.dashboard.label1h')
              ],
              type: 'line',
              formatter: seconds.detailed
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>

        <DashboardSection title={t('in-forge:plugins.beeInstana.dashboard.titlePrunedObservations')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: [
                'Aggregator.AggregatorPrune.period10.NumPrunedObservations.max',
                'Aggregator.AggregatorPrune.period60.NumPrunedObservations.max',
                'Aggregator.AggregatorPrune.period300.NumPrunedObservations.max',
                'Aggregator.AggregatorPrune.period3600.NumPrunedObservations.max'
              ],
              labels: [
                t('in-forge:plugins.beeInstana.dashboard.label10s'),
                t('in-forge:plugins.beeInstana.dashboard.label1m'),
                t('in-forge:plugins.beeInstana.dashboard.label5m'),
                t('in-forge:plugins.beeInstana.dashboard.label1h')
              ],
              type: 'line',
              formatter: number.compact
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>

        <DashboardSection title={t('in-forge:plugins.beeInstanaNode.filesOpenedForRead')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: [
                'Aggregator.AggregatorPrune.period10.NumOpenedMetricDbs.max',
                'Aggregator.AggregatorPrune.period60.NumOpenedMetricDbs.max',
                'Aggregator.AggregatorPrune.period300.NumOpenedMetricDbs.max',
                'Aggregator.AggregatorPrune.period3600.NumOpenedMetricDbs.max'
              ],
              labels: [
                t('in-forge:plugins.beeInstana.dashboard.label10s'),
                t('in-forge:plugins.beeInstana.dashboard.label1m'),
                t('in-forge:plugins.beeInstana.dashboard.label5m'),
                t('in-forge:plugins.beeInstana.dashboard.label1h')
              ],
              type: 'line',
              formatter: number.compact
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </div>
    );
  }
}
