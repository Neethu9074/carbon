import React from 'react';

import {
  number,
  bytesZeroDecimalPlaces,
  bytesTwoDecimalPlaces,
  zeroDecimalPlaces,
  twoDecimalPlaces
} from 'in-services/formatters/number';

import { KpiSection, KpiHeading, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart';
import MetricValue from 'in-components/MetricValue';
import { getLabel } from 'in-sdk/snapshot';

export default function AzureAppServiceDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <KpiSection>
        <KpiHeading>{getLabel(snapshot)}</KpiHeading>

        <KpiKeyValue label="Operations Per Second">
          <MetricValue snapshotId={snapshotId} metric="operationsPerSecond" formatter={zeroDecimalPlaces} />
        </KpiKeyValue>

        <KpiKeyValue label="Keys Evicted">
          <MetricValue snapshotId={snapshotId} metric="evictedkeys" />
        </KpiKeyValue>

        <KpiKeyValue label="Connections">
          <MetricValue snapshotId={snapshotId} metric="connectedclients" />
        </KpiKeyValue>
      </KpiSection>

      <DashboardSection title="Operations Per Second">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['operationsPerSecond'],
            labels: ['Operations Per Second'],
            formatter: number.detailed,
            type: 'line'
          }}
        />
      </DashboardSection>

      <DashboardSection title="Cache Hits/Misses">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['cachehits', 'cachemisses'],
            labels: ['Cache Hits', 'Cache Misses'],
            type: 'line'
          }}
        />
      </DashboardSection>

      <DashboardSection title="Gets/Sets">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: number.detailed,
            metrics: ['getcommands', 'setcommands'],
            labels: ['Gets', 'Sets'],
            type: 'line'
          }}
        />
      </DashboardSection>

      <DashboardSection title="Keys Expired/Evicted">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['expiredkeys', 'evictedkeys'],
            labels: ['Keys Expired', 'Keys Evicted'],
            type: 'line'
          }}
        />
      </DashboardSection>

      <DashboardSection title="Memory">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: bytesZeroDecimalPlaces,
            tooltipFormatter: bytesTwoDecimalPlaces,
            metrics: ['usedmemory', 'usedmemoryRss'],
            labels: ['Used', 'Used RSS'],
            type: 'line'
          }}
        />
      </DashboardSection>

      <DashboardSection title="Cache Read/Write">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: bytesZeroDecimalPlaces,
            tooltipFormatter: bytesTwoDecimalPlaces,
            metrics: ['cacheRead', 'cacheWrite'],
            labels: ['Cache Read', 'Cache Write'],
            type: 'line'
          }}
        />
      </DashboardSection>

      <DashboardSection title="Total Operations">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['totalcommandsprocessed'],
            labels: ['Total Operations'],
            formatter: number.detailed,
            type: 'line'
          }}
        />
      </DashboardSection>

      <DashboardSection title="Total Keys">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['totalkeys'],
            labels: ['Total Keys'],
            formatter: number.detailed,
            type: 'line'
          }}
        />
      </DashboardSection>

      <DashboardSection title="Server Load">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['serverLoad'],
            labels: ['Server Load'],
            formatter: number.detailed,
            type: 'line'
          }}
        />
      </DashboardSection>

      <DashboardSection title="CPU">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['percentProcessorTime'],
            labels: ['CPU'],
            formatter: twoDecimalPlaces,
            type: 'line'
          }}
        />
      </DashboardSection>
    </div>
  );
}
