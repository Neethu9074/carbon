import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import TwoColumnRow from 'in-sdk/components/dashboard/TwoColumnRow';
import Chart from 'in-components/Chart'
import { zeroDecimalPlaces, bytesZeroDecimalPlaces, bytesTwoDecimalPlaces } from 'in-services/formatters/number';

import NodesTable from './NodesTable';
import AppsTable from './AppsTable';

export default function Dashboard({ snapshot, timeframe }) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <DashboardSection title="Cluster Nodes">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          margins={{
            left: 80
          }}
          y1={{
            metrics: ['activeNodes', 'lostNodes', 'unhealthyNodes', 'decommissionedNodes'],
            labels: ['Active Nodes', 'Lost Nodes', 'Unhealthy Nodes', 'Decommissioned Nodes'],
            formatter: zeroDecimalPlaces,
            type: 'stackedArea'
          }}
        />
      </DashboardSection>
      <TwoColumnRow>
        <DashboardSection title="Apps">
          <Chart
            snapshotId={snapshotId}
            timeframe={timeframe}
            margins={{
              left: 80
            }}
            y1={{
              metrics: ['appsRunning', 'appsPending', 'appsFailed'],
              labels: ['Apps Running', 'Apps Pending', 'Apps Failed'],
              formatter: zeroDecimalPlaces,
              type: 'stackedArea'
            }}
          />
        </DashboardSection>
        <DashboardSection title="Cluster Containers">
          <Chart
            snapshotId={snapshotId}
            timeframe={timeframe}
            margins={{
              left: 80
            }}
            y1={{
              metrics: ['containersRunning'],
              labels: ['Containers Running'],
              formatter: zeroDecimalPlaces,
              type: 'stackedArea'
            }}
          />
        </DashboardSection>
      </TwoColumnRow>
      <TwoColumnRow>
        <DashboardSection title="Cluster Memory">
          <Chart
            snapshotId={snapshotId}
            timeframe={timeframe}
            margins={{
              left: 80
            }}
            y1={{
              metrics: ['usedMemory', 'availableMemory', 'reservedMemory'],
              labels: ['Used Memory', 'Available Memory', 'Reserved Memory'],
              formatter: bytesZeroDecimalPlaces,
              tooltipFormatter: bytesTwoDecimalPlaces,
              type: 'stackedArea'
            }}
          />
        </DashboardSection>
        <DashboardSection title="Cluster Virtual Cores">
          <Chart
            snapshotId={snapshotId}
            timeframe={timeframe}
            margins={{
              left: 80
            }}
            y1={{
              metrics: ['usedVirtualCores', 'availableVirtualCores', 'reservedVirtualCores'],
              labels: ['Used Virtual Cores', 'Available Virtual Cores', 'Reserved Virtual Cores'],
              formatter: zeroDecimalPlaces,
              type: 'stackedArea'
            }}
          />
        </DashboardSection>
      </TwoColumnRow>
      <NodesTable snapshot={snapshot} timeframe={timeframe} />
      <AppsTable snapshot={snapshot} timeframe={timeframe} />
    </div>
  );
}
