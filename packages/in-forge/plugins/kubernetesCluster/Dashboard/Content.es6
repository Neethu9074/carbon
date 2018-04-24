import React from 'react';

import { zeroDecimalPlaces, twoDecimalPlaces, bytesTwoDecimalPlaces, percentage } from 'in-services/formatters/number';
import { KpiSection, KpiHeading, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Columize from 'in-sdk/components/dashboard/Columize';
import MetricValue from 'in-components/MetricValue';
import DeploymentsTable from './DeploymentsTable';
import { getLabel } from 'in-sdk/snapshot';
import Chart from 'in-components/Chart';
import NodesTable from './NodesTable';

export default function KubernetesClusterDashboard({ snapshot, timeframe }) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <KpiSection>
        <KpiHeading>{getLabel(snapshot)}</KpiHeading>
        <KpiKeyValue label="Node Count">
          <MetricValue snapshotId={snapshotId} metric="nodes.count" formatter={zeroDecimalPlaces} />
        </KpiKeyValue>
        <KpiKeyValue label="Pods Allocation">
          <MetricValue snapshotId={snapshotId} metric="allocatedCapacityPodsRatio" formatter={percentage.detailed} />
        </KpiKeyValue>
        <KpiKeyValue label="CPU Requests Allocation">
          <MetricValue snapshotId={snapshotId} metric="requiredCapacityCPURatio" formatter={percentage.detailed} />
        </KpiKeyValue>
        <KpiKeyValue label="CPU Limits Allocation">
          <MetricValue snapshotId={snapshotId} metric="limitCapacityCPURatio" formatter={percentage.detailed} />
        </KpiKeyValue>
        <KpiKeyValue label="Memory Requests Allocation">
          <MetricValue snapshotId={snapshotId} metric="requiredCapacityMemoryRatio" formatter={percentage.detailed} />
        </KpiKeyValue>
        <KpiKeyValue label="Memory Limits Allocation">
          <MetricValue snapshotId={snapshotId} metric="limitCapacityMemoryRatio" formatter={percentage.detailed} />
        </KpiKeyValue>
      </KpiSection>

      <Columize>
        <DashboardSection title="CPU Resources">
          <Chart
            snapshotId={snapshotId}
            timeframe={timeframe}
            y1={{
              formatter: twoDecimalPlaces,
              metrics: ['requiredCPU', 'limitCPU', 'nodes.capacity_cpu'],
              labels: ['CPU Requests', 'CPU Limits', 'CPU Capacity'],
              type: 'line'
            }}
          />
        </DashboardSection>
        <DashboardSection title="Memory Resources">
          <Chart
            snapshotId={snapshotId}
            timeframe={timeframe}
            y1={{
              formatter: bytesTwoDecimalPlaces,
              metrics: ['requiredMemory', 'limitMemory', 'nodes.capacity_mem'],
              labels: ['Memory Requests', 'Memory Limits', 'Memory Capacity'],
              type: 'line'
            }}
          />
        </DashboardSection>
      </Columize>
      <DashboardSection title="Pods">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          y1={{
            formatter: zeroDecimalPlaces,
            metrics: ['podsRunning', 'podsPending', 'pods.count', 'nodes.capacity_pods'],
            labels: ['Running Pods', 'Pending Pods', 'Allocated Pods', 'Pods Capacity'],
            type: 'line'
          }}
        />
      </DashboardSection>

      <DashboardSection title="Replicas">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          y1={{
            formatter: zeroDecimalPlaces,
            metrics: ['availableReplicas', 'desiredReplicas'],
            labels: ['Available Replicas', 'Desired Replicas'],
            type: 'line'
          }}
        />
      </DashboardSection>

      <NodesTable snapshot={snapshot} timeframe={timeframe} />

      <DeploymentsTable snapshot={snapshot} timeframe={timeframe} />
    </div>
  );
}
