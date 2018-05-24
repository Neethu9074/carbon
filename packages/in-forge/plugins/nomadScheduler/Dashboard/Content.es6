import React from 'react';

import { getLabel } from 'in-sdk/snapshot';
import Columize from 'in-sdk/components/dashboard/Columize';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { KpiSection, KpiHeading, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import Chart from 'in-components/Chart';
import MetricValue from 'in-components/MetricValue';
import DashboardNotification from 'in-components/DashboardNotification';
import { number, withSiPrefixZeroDecimalPlaces } from 'in-services/formatters/number';
import GaugesTable from './GaugesTable';

export default function NomadDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  const errorCode = snapshot.getIn(['data', 'error_code']);
  const nomadVersion = snapshot.getIn(['data', 'nomad_version']);

  if (errorCode !== 'NO_ERROR') {
    return (
      <DashboardNotification type="warning">
        <strong>Nomad version too old</strong>
        <p>
          The Nomad version you are using is too old and does not provide metrics. Please upgrade to version 0.7 or
          higher to receive metrics in this dashboard.
        </p>
        <p>
          Current Nomad Version: <code>{nomadVersion}</code>
        </p>
      </DashboardNotification>
    );
  } else {
    return (
      <div>
        <KpiSection>
          <KpiHeading>{getLabel(snapshot)}</KpiHeading>
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
          <DashboardSection title="Allocated/Unallocated CPU (MHz)">
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
            />
          </DashboardSection>
          <DashboardSection title="Allocated/Unallocated memory">
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
          />
        </DashboardSection>
        <Columize>
          <GaugesTable snapshot={snapshot} timeConfig={timeConfig} />
        </Columize>
      </div>
    );
  }
}
