import React from 'react';

import {
  bytesTwoDecimalPlaces,
  timeByNanoTwoDecimalPlaces,
  percentageZeroDecimalPlaces,
  percentageTwoDecimalPlaces
} from 'in-services/formatters/number';
import { KpiSection, KpiHeading, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import MetricValue from 'in-components/MetricValue';
import { getLabel } from 'in-sdk/snapshot';
import Chart from 'in-components/Chart';

export default function ContainerdDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <KpiSection>
        <KpiHeading>{getLabel(snapshot)}</KpiHeading>
        <KpiKeyValue label="CPU Total %">
          <MetricValue snapshotId={snapshotId} metric="cpu.total_usage" formatter={percentageZeroDecimalPlaces} />
        </KpiKeyValue>
        <KpiKeyValue label="Memory Usage">
          <MetricValue snapshotId={snapshotId} metric="memory.usage" formatter={bytesTwoDecimalPlaces} />
        </KpiKeyValue>
      </KpiSection>

      <DashboardSection title="CPU">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['cpu.total_usage', 'cpu.system_usage', 'cpu.user_usage'],
            labels: ['Total', 'Kernel', 'User'],
            formatter: percentageTwoDecimalPlaces,
            type: 'line'
          }}
        />
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['cpu.throttling_count'],
            labels: ['Throttling count'],
            type: 'line'
          }}
          y2={{
            min: 0,
            metrics: ['cpu.throttling_time'],
            labels: ['Throttling time'],
            type: 'line',
            formatter: timeByNanoTwoDecimalPlaces
          }}
        />
      </DashboardSection>
      <DashboardSection title={`Memory`}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['memory.usage', 'memory.total_rss', 'memory.total_cache'],
            labels: ['Usage', 'RSS', 'Cache'],
            formatter: bytesTwoDecimalPlaces,
            type: 'line'
          }}
        />
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['memory.active_anon', 'memory.active_file', 'memory.inactive_anon', 'memory.inactive_file'],
            labels: ['Active anonymous', 'Active cache', 'Inactive anonymous', 'Inactive cache'],
            formatter: bytesTwoDecimalPlaces,
            type: 'line'
          }}
        />
      </DashboardSection>

      <DashboardSection title="Block IO">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['blkio.blk_read', 'blkio.blk_write'],
            labels: ['Read', 'Write'],
            type: 'line',
            formatter: bytesTwoDecimalPlaces
          }}
        />
      </DashboardSection>
    </div>
  );
}
