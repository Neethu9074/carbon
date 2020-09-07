import React from 'react';

import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import { number, twoDecimalPlaces, bytes } from 'in-services/formatters/number';
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
              metric="Ingestor.Aggregate.NumOfMetrics.max"
              formatter={number.compact}
            />
          </KpiKeyValue>
          <KpiKeyValue label="Datapoints">
            <MetricValue
              snapshotId={snapshotId}
              metric="Ingestor.Aggregate.NumOfDatapoints.max"
              formatter={number.compact}
            />
          </KpiKeyValue>
          <KpiKeyValue label="Observations">
            <MetricValue
              snapshotId={snapshotId}
              metric="Ingestor.Aggregate.NumOfObservations.max"
              formatter={number.compact}
            />
          </KpiKeyValue>
          <KpiKeyValue label="Package size">
            <MetricValue
              snapshotId={snapshotId}
              metric="Ingestor.Aggregate.MetricPackageSize.max"
              formatter={bytes.compact}
            />
          </KpiKeyValue>
        </KpiSection>

        <DashboardSection title="Counts">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: [
                'Ingestor.Aggregate.NumOfMetrics.max',
                'Ingestor.Aggregate.NumOfObservations.max',
                'Ingestor.Aggregate.NumOfDatapoints.max'
              ],
              labels: ['Metrics', 'Observations', 'Datapoints'],
              type: 'line',
              formatter: number.compact
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>

        <DashboardSection title="Package">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['Ingestor.Aggregate.MetricPackageSize.max'],
              labels: ['Size'],
              type: 'line',
              formatter: bytes.detailed
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>

        <DashboardSection title="Task queue">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['Ingestor.Aggregate.TaskQueueSize.max'],
              labels: ['Size'],
              type: 'line',
              formatter: number.compact
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>

        <DashboardSection title="Clients">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['Ingestor.Connection.NumOfClients.max'],
              labels: ['Count'],
              type: 'line',
              formatter: number.compact
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>

        <DashboardSection title="Connections">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['Ingestor.Connection.TotalConnections.max'],
              labels: ['Count'],
              type: 'line',
              formatter: number.compact
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>

        <DashboardSection title="Authentications failed">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['Ingestor.Authentication.Failed.max'],
              labels: ['Count'],
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

        <DashboardSection title="Metric pruning durations (seconds)">
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
              formatter: twoDecimalPlaces
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

        <DashboardSection title="Connection pool statistics">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: [
                'Aggregator.QueryConnectionPool.NumRequests.max',
                'Aggregator.QueryConnectionPool.NumNewSessions.max',
                'Aggregator.QueryConnectionPool.NumConnectionsReuse.max'
              ],
              labels: ['Requests', 'New sessions', 'Connections reused'],
              type: 'line',
              formatter: number.compact
            }}
            y2={{
              min: 0,
              metrics: [
                'Aggregator.QueryConnectionPool.PoolCapacity.max',
                'Aggregator.QueryConnectionPool.PoolSize.max'
              ],
              labels: ['Pool capacity', 'Pool size'],
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
