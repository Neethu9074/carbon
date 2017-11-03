import React from 'react';

import { zeroDecimalPlaces, twoDecimalPlaces, bytesTwoDecimalPlaces } from 'in-services/formatters/number';
import { KpiSection, KpiHeading, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import NodesTable from 'in-forge/plugins/kubernetesCluster/Dashboard/NodesTable';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Columize from 'in-sdk/components/dashboard/Columize';
import { emptyList } from 'in-services/fixedImmutables';
import MetricValue from 'in-components/MetricValue';
import { getLabel } from 'in-sdk/snapshot';
import Chart from 'in-components/Chart';

export default function KubernetesClusterDashboard({ snapshot, timeframe }) {
  const snapshotId = snapshot.get('id');
  const nodeIds = snapshot.getIn(['data', 'nodes.itemIds'], emptyList).toArray();
  return (
    <div>
      <KpiSection>
        <KpiHeading>{getLabel(snapshot)}</KpiHeading>
        <KpiKeyValue label="Node Count">
          <MetricValue snapshotId={snapshotId} initialValue={nodeIds.length} formatter={zeroDecimalPlaces} />
        </KpiKeyValue>
      </KpiSection>

      <Columize>
        <DashboardSection title="CPU Shares">
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
        <DashboardSection title="Memory">
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
        <DashboardSection title="Pod Count">
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
        <DashboardSection title="Pods">
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

      <DashboardSection title="Replicas">
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
    </div>
  );
}
