import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Columize from 'in-sdk/components/dashboard/Columize';
import Chart from 'in-components/Chart';
import { zeroDecimalPlaces, bytesZeroDecimalPlaces, bytesTwoDecimalPlaces } from 'in-services/formatters/number';

import WorkersTable from './WorkersTable';
import AppsTable from './AppsTable';
import DriversTable from './DriversTable';

export default function Dashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <DashboardSection title="Cluster Workers">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: [
              'workers.aliveWorkers',
              'workers.deadWorkers',
              'workers.decommissionedWorkers',
              'workers.workersInUnknownState'
            ],
            labels: ['Alive Workers', 'Dead Workers', 'Decommissioned Workers', 'Workers In Unknown State'],
            formatter: zeroDecimalPlaces,
            type: 'stackedArea'
          }}
        />
      </DashboardSection>
      <Columize>
        <DashboardSection title="Cluster Memory">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['workers.memoryInUseTotal', 'workers.memoryTotal'],
              labels: ['Used Memory', 'Total Memory'],
              formatter: bytesZeroDecimalPlaces,
              tooltipFormatter: bytesTwoDecimalPlaces,
              type: 'line'
            }}
          />
        </DashboardSection>
        <DashboardSection title="Cluster Cores">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['workers.coresInUseTotal', 'workers.coresTotal'],
              labels: ['Used Cores', 'Total Cores'],
              formatter: zeroDecimalPlaces,
              type: 'line'
            }}
          />
        </DashboardSection>
      </Columize>
      <WorkersTable snapshot={snapshot} timeConfig={timeConfig} />
      <AppsTable snapshot={snapshot} />
      <DriversTable snapshot={snapshot} />
    </div>
  );
}
