import React from 'react';

import { zeroDecimalPlaces } from 'in-services/formatters/number';

import Chart from 'in-components/Chart';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';

import CacheLatencyThroughputTable from './CacheLatencyThroughputTable.es6';
import CacheHitsAndMissesTable from './CacheHitsAndMissesTable.es6';
import CacheOtherStatsTable from './CacheOtherStatsTable.es6';
import CacheManagersTable from './CacheManagersTable.es6';
import JgroupsDefaultThreadPoolTable from './JgroupsDefaultThreadPoolTable.es6';
import JgroupsOOBThreadPoolTable from './JgroupsOOBThreadPoolTable.es6';
import JgroupsTimerThreadPoolTable from './JgroupsTimerThreadPoolTable.es6';

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
