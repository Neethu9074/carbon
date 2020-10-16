import React from 'react';

import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import { number, bytes, millis, seconds } from 'in-services/formatters/number';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { yesOrNo } from 'in-services/formatters/boolean';
import MetricValue from 'in-components/MetricValue';

export default function BeeInstanaDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  const label = snapshot.getIn(['data', 'label']);

  if (label === 'ingestor') {
    return (
      <div>
        <KpiSection>
          <KpiKeyValue label="Metrics">
            <MetricValue
              snapshotId={snapshotId}
              metric="Ingestor.AggregatorFlushByTimeAndPartition.NumOfMetrics.sum"
              formatter={number.compact}
            />
          </KpiKeyValue>
          <KpiKeyValue label="Messages">
            <MetricValue
              snapshotId={snapshotId}
              metric="Ingestor.KafkaConsumer.MessageDelay.count"
              formatter={number.compact}
            />
          </KpiKeyValue>
          <KpiKeyValue label="Errors">
            <MetricValue snapshotId={snapshotId} metric="Ingestor.KafkaConsumer.Error.sum" formatter={number.compact} />
          </KpiKeyValue>
          <KpiKeyValue label="SpillOver">
            <MetricValue
              snapshotId={snapshotId}
              metric="Ingestor.KafkaConsumer.SpillOver.sum"
              formatter={bytes.compact}
            />
          </KpiKeyValue>
        </KpiSection>

        <DashboardSection title="Metrics">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['Ingestor.AggregatorFlushByTimeAndPartition.NumOfMetrics.sum'],
              labels: ['Count'],
              type: 'line',
              formatter: number.detailed
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>

        <DashboardSection title="Kafka message consumer">
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
              labels: ['Metric count', 'Datapoint count', 'Message count', 'Message error count'],
              type: 'line',
              formatter: number.compact
            }}
            y2={{
              min: 0,
              metrics: ['Ingestor.KafkaConsumer.MessageDelay.max'],
              labels: ['Message delay'],
              type: 'line',
              formatter: millis.compact
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>

        <DashboardSection title="Queue and worker">
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
              labels: ['MaxQueueSize', 'TaskQueueSize', 'SpillOver', 'WorkerPoolSize'],
              type: 'line',
              formatter: number.detailed
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>

        <DashboardSection title="Flush">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['Ingestor.AggregatorFlushByTimeAndPartition.Duration.max'],
              labels: ['Duration'],
              type: 'line',
              formatter: seconds.detailed
            }}
            y2={{
              min: 0,
              metrics: ['Ingestor.AggregatorFlushByTimeAndPartition.Duration.count'],
              labels: ['Count'],
              type: 'line',
              formatter: number.compact
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>

        <DashboardSection title="Sender">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['Ingestor.HttpSender.SucceededBytes.sum', 'Ingestor.HttpSender.FailedBytes.sum'],
              labels: ['SucceededBytes', 'FailedBytes'],
              type: 'line',
              formatter: bytes.compact
            }}
            y2={{
              min: 0,
              metrics: ['Ingestor.HttpSender.SucceededBytes.count', 'Ingestor.HttpSender.FailedBytes.count'],
              labels: ['Succeeded count', 'Failed count'],
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
          <KpiKeyValue label="Metrics">
            <MetricValue
              snapshotId={snapshotId}
              metric="Aggregator.AggregatorStats.NumMetricsWithData.max"
              formatter={number.compact}
            />
          </KpiKeyValue>
          <KpiKeyValue label="Ready">
            <MetricValue snapshotId={snapshotId} metric="Aggregator.Status.Ready.max" formatter={yesOrNo} />
          </KpiKeyValue>
          <KpiKeyValue label="Aggregate datasize">
            <MetricValue
              snapshotId={snapshotId}
              metric="Aggregator.AggregateBinary.DataSize.max"
              formatter={bytes.compact}
            />
          </KpiKeyValue>
          <KpiKeyValue label="Throttled accounts">
            <MetricValue
              snapshotId={snapshotId}
              metric="Aggregator.AggregatorStats.NumThrottledAccounts.max"
              formatter={number.compact}
            />
          </KpiKeyValue>
        </KpiSection>

        <DashboardSection title="Metrics">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['Aggregator.AggregatorStats.NumMetricsWithData.max'],
              labels: ['Count'],
              type: 'line',
              formatter: number.detailed
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>

        <DashboardSection title="Queue">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['Aggregator.AggregateBinary.SpillOver.sum', 'Aggregator.AggregatorStats.TaskQueueSize.max'],
              labels: ['SpillOver', 'TaskQueueSize'],
              type: 'line',
              formatter: number.detailed
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>

        <DashboardSection title="GetMetrics API">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['Aggregator.GetMetrics.Timing.max', 'Aggregator.GetMetrics.Timing.min'],
              labels: ['Max latency', 'Min latency'],
              type: 'line',
              formatter: millis.compact
            }}
            y2={{
              min: 0,
              metrics: ['Aggregator.GetMetrics.Timing.count'],
              labels: ['Request count'],
              type: 'line',
              formatter: number.compact
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>

        <DashboardSection title="GetMetricData API">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['Aggregator.GetMetricData.Timing.max', 'Aggregator.GetMetricData.Timing.min'],
              labels: ['Max latency', 'Min latency'],
              type: 'line',
              formatter: millis.compact
            }}
            y2={{
              min: 0,
              metrics: ['Aggregator.GetMetricData.Timing.count'],
              labels: ['Request count'],
              type: 'line',
              formatter: number.compact
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>

        <DashboardSection title="Metric pruning durations">
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
              labels: ['10s period', '1m period', '5m period', '1h period'],
              type: 'line',
              formatter: seconds.detailed
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>

        <DashboardSection title="Pruned observations">
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
              labels: ['10s period', '1m period', '5m period', '1h period'],
              type: 'line',
              formatter: number.compact
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>

        <DashboardSection title="Move to longterm storage durations">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: [
                'Aggregator.MoveToLongtermStorage.period10.Duration.max',
                'Aggregator.MoveToLongtermStorage.period60.Duration.max',
                'Aggregator.MoveToLongtermStorage.period300.Duration.max',
                'Aggregator.MoveToLongtermStorage.period3600.Duration.max'
              ],
              labels: ['10s period', '1m period', '5m period', '1h period'],
              type: 'line',
              formatter: seconds.detailed
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>

        <DashboardSection title="Big chunks opened (for read)">
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
              labels: ['10s period', '1m period', '5m period', '1h period'],
              type: 'line',
              formatter: number.compact
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>

        <DashboardSection title="Small chunks opened (for write)">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: [
                'Aggregator.AggregatorPrune.period10.NumLiveColumnFamilies.max',
                'Aggregator.AggregatorPrune.period60.NumLiveColumnFamilies.max',
                'Aggregator.AggregatorPrune.period300.NumLiveColumnFamilies.max',
                'Aggregator.AggregatorPrune.period3600.NumLiveColumnFamilies.max'
              ],
              labels: ['10s period', '1m period', '5m period', '1h period'],
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
