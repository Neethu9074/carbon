import React from 'react';

import { zeroDecimalPlaces } from 'in-services/formatters/number';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';

import JgroupsDefaultThreadPoolTable from './JgroupsDefaultThreadPoolTable.js';
import CacheLatencyThroughputTable from './CacheLatencyThroughputTable.js';
import JgroupsTimerThreadPoolTable from './JgroupsTimerThreadPoolTable.js';
import JgroupsOOBThreadPoolTable from './JgroupsOOBThreadPoolTable.js';
import CacheHitsAndMissesTable from './CacheHitsAndMissesTable.js';
import CacheOtherStatsTable from './CacheOtherStatsTable.js';
import CacheManagersTable from './CacheManagersTable.js';

export default function JbossDataGridDashboard({ snapshot, timeConfig }) {
  return (
    <div>
      <JgroupsOOBThreadPoolTable snapshot={snapshot} timeConfig={timeConfig} />
      <JgroupsTimerThreadPoolTable snapshot={snapshot} timeConfig={timeConfig} />
      <JgroupsDefaultThreadPoolTable snapshot={snapshot} timeConfig={timeConfig} />
      <CacheLatencyThroughputTable snapshot={snapshot} timeConfig={timeConfig} />
      <CacheHitsAndMissesTable snapshot={snapshot} timeConfig={timeConfig} />
      <CacheOtherStatsTable snapshot={snapshot} timeConfig={timeConfig} />
      <CacheManagersTable snapshot={snapshot} timeConfig={timeConfig} />
      <DashboardSection title="Hot Rod Connections">
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            formatter: zeroDecimalPlaces,
            metrics: ['hotRod.numberOfLocalConnections', 'hotRod.numberOfGlobalConnections'],
            labels: ['Number Of Local Connections', 'Number Of Global Connections'],
            type: 'line'
          }}
        />
      </DashboardSection>
    </div>
  );
}
