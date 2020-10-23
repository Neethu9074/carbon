import React from 'react';

import { number, withSiPrefixZeroDecimalPlaces } from 'in-services/formatters/number';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import Columize from 'in-sdk/components/dashboard/Columize';
import MetricValue from 'in-components/MetricValue';
import GaugesTable from './GaugesTable';

export default function NomadDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  const errorCode = snapshot.getIn(['data', 'error_code']);

  if (errorCode !== 'NO_ERROR') {
    return (
      <DashboardNotification type="warning">
        <strong>Nomad metrics are not available</strong>
        <p>Please check if the Nomad metrics endpoint is reachable.</p>
      </DashboardNotification>
    );
  } else {
    return (
      <div>
        <KpiSection>
          <KpiKeyValue label="Running">
            <MetricValue snapshotId={snapshotId} metric="nomad.client.allocations.running" formatter={number.compact} />
          </KpiKeyValue>
          <KpiKeyValue label="Migrating">
            <MetricValue
              snapshotId={snapshotId}
              metric="nomad.client.allocations.migrating"
              formatter={number.compact}
            />
          </KpiKeyValue>
          <KpiKeyValue label="Pending">
            <MetricValue snapshotId={snapshotId} metric="nomad.client.allocations.pending" formatter={number.compact} />
          </KpiKeyValue>
          <KpiKeyValue label="Terminal">
            <MetricValue
              snapshotId={snapshotId}
              metric="nomad.client.allocations.terminal"
              formatter={number.compact}
            />
          </KpiKeyValue>
          <KpiKeyValue label="Blocked">
            <MetricValue snapshotId={snapshotId} metric="nomad.client.allocations.blocked" formatter={number.compact} />
          </KpiKeyValue>
        </KpiSection>
        <Columize>
          <DashboardSection title="CPU (MHz)">
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: ['nomad.client.allocated.cpu', 'nomad.client.unallocated.cpu'],
                labels: ['Allocated CPU', 'Unallocated CPU'],
                formatter: withSiPrefixZeroDecimalPlaces,
                type: 'stackedArea'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </DashboardSection>
          <DashboardSection title="Memory">
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: ['nomad.client.allocated.memory', 'nomad.client.unallocated.memory'],
                labels: ['Allocated memory', 'Unallocated memory'],
                formatter: withSiPrefixZeroDecimalPlaces,
                type: 'stackedArea'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </DashboardSection>
        </Columize>
        <Columize>
          <DashboardSection title="Disk">
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: ['nomad.client.allocated.disk', 'nomad.client.unallocated.disk'],
                labels: ['Allocated disk', 'Unallocated disk'],
                formatter: withSiPrefixZeroDecimalPlaces,
                type: 'stackedArea'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </DashboardSection>
          <DashboardSection title="IOPS">
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: ['nomad.client.allocated.iops', 'nomad.client.unallocated.iops'],
                labels: ['Allocated IOPS', 'Unallocated IOPS'],
                formatter: withSiPrefixZeroDecimalPlaces,
                type: 'stackedArea'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </DashboardSection>
        </Columize>
        <DashboardSection title="Allocations">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: [
                'nomad.client.allocations.running',
                'nomad.client.allocations.migrating',
                'nomad.client.allocations.pending',
                'nomad.client.allocations.terminal',
                'nomad.client.allocations.blocked'
              ],
              labels: ['Running', 'Migrating', 'Pending', 'Terminal', 'Blocked'],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <Columize>
          <DashboardSection title="Broker Core">
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: ['nomad.nomad.broker._core.unacked', 'nomad.nomad.broker._core.ready'],
                labels: ['Unacknowledged', 'Ready'],
                type: 'line'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </DashboardSection>
          <DashboardSection title="Broker">
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: [
                  'nomad.nomad.broker.total_unacked',
                  'nomad.nomad.broker.total_waiting',
                  'nomad.nomad.broker.total_ready',
                  'nomad.nomad.broker.total_blocked'
                ],
                labels: ['Unacknowledged', 'Waiting', 'Ready', 'Blocked'],
                type: 'line'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </DashboardSection>
        </Columize>
        <DashboardSection title="Total Blocked Evaluations">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: [
                'nomad.nomad.blocked_evals.total_quota_limit',
                'nomad.nomad.blocked_evals.total_blocked',
                'nomad.nomad.blocked_evals.total_escaped'
              ],
              labels: ['Quota limit', 'Blocked', 'Escaped'],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <Columize>
          <GaugesTable snapshot={snapshot} timeConfig={timeConfig} />
        </Columize>
      </div>
    );
  }
}
