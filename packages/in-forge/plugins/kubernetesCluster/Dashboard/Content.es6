import React from 'react';

import { zeroDecimalPlaces, twoDecimalPlaces, bytesTwoDecimalPlaces } from 'in-services/formatters/number';
import { KpiSection, KpiHeading, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Columize from 'in-sdk/components/dashboard/Columize';
import { emptyList } from 'in-services/fixedImmutables';
import MetricValue from 'in-components/MetricValue';
import { getLabel } from 'in-sdk/snapshot';
import Chart from 'in-components/Chart';

import DeploymentsTable from './DeploymentsTable';
import NodesTable from './NodesTable';

export default function KubernetesClusterDashboard({ snapshot, timeframe }) {
  const snapshotId = snapshot.get('id');
  const nodeIds = snapshot.getIn(['data', 'nodes.itemIds'], emptyList).toArray();
  return (
    <div>
      <KpiSection>
        <KpiHeading>{getLabel(snapshot)}</KpiHeading>
        <KpiKeyValue label="Node Count">
          <MetricValue snapshotId={snapshotId} initialValue={String(nodeIds.length)} formatter={zeroDecimalPlaces} />
        </KpiKeyValue>
        <KpiKeyValue label="Pod count">
          <MetricValue snapshotId={snapshotId} metric="pods.count" formatter={zeroDecimalPlaces} />
        </KpiKeyValue>
        <KpiKeyValue label="CPU Shares Allocatable">
          <MetricValue snapshotId={snapshotId} metric="nodes.allocatable_cpu" formatter={twoDecimalPlaces} />
        </KpiKeyValue>
        <KpiKeyValue label="CPU Shares Limit">
          <MetricValue snapshotId={snapshotId} metric="nodes.capacity_cpu" formatter={twoDecimalPlaces} />
        </KpiKeyValue>
        <KpiKeyValue label="Memory Allocatable">
          <MetricValue snapshotId={snapshotId} metric="nodes.allocatable_mem" formatter={bytesTwoDecimalPlaces} />
        </KpiKeyValue>
        <KpiKeyValue label="Memory Limit">
          <MetricValue snapshotId={snapshotId} metric="nodes.capacity_mem" formatter={bytesTwoDecimalPlaces} />
        </KpiKeyValue>
      </KpiSection>

      <Columize>
        <DashboardSection title="Allocatable vs Limit CPU Shares">
          <Chart
            snapshotId={snapshotId}
            timeframe={timeframe}
            margins={{
              left: 80
            }}
            y1={{
              formatter: twoDecimalPlaces,
              metrics: ['nodes.allocatable_cpu', 'nodes.capacity_cpu'],
              labels: ['Allocatable', 'Limit'],
              type: 'line'
            }}
          />
        </DashboardSection>
        <DashboardSection title="Allocatable vs Limit Memory">
          <Chart
            snapshotId={snapshotId}
            timeframe={timeframe}
            margins={{
              left: 80
            }}
            y1={{
              formatter: bytesTwoDecimalPlaces,
              metrics: ['nodes.allocatable_mem', 'nodes.capacity_mem'],
              labels: ['Allocatable', 'Limit'],
              type: 'line'
            }}
          />
        </DashboardSection>
      </Columize>

      <Columize>
        <DashboardSection title="Running Pods">
          <Chart
            snapshotId={snapshotId}
            timeframe={timeframe}
            margins={{
              left: 80
            }}
            y1={{
              formatter: zeroDecimalPlaces,
              metrics: ['pods.count'],
              labels: ['Pods'],
              type: 'line'
            }}
          />
        </DashboardSection>
        <DashboardSection title="Allocatable vs Limit Pods">
          <Chart
            snapshotId={snapshotId}
            timeframe={timeframe}
            margins={{
              left: 80
            }}
            y1={{
              formatter: zeroDecimalPlaces,
              metrics: ['nodes.allocatable_pods', 'nodes.capacity_pods'],
              labels: ['Allocatable', 'Limit'],
              type: 'line'
            }}
          />
        </DashboardSection>
      </Columize>

      <DashboardSection title="Available vs Desired Replicas">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          margins={{
            left: 80
          }}
          y1={{
            formatter: zeroDecimalPlaces,
            metrics: ['availableReplicas', 'desiredReplicas'],
            labels: ['Available', 'Desired'],
            type: 'line'
          }}
        />
      </DashboardSection>

      <NodesTable snapshot={snapshot} timeframe={timeframe} />

      <DeploymentsTable snapshot={snapshot} timeframe={timeframe} />
    </div>
  );
}
