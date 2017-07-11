import React from 'react';

import { bytesZeroDecimalPlaces, zeroDecimalPlaces, hitRateZeroDecimalPlaces } from 'in-services/formatters/number';
import { KpiSection, KpiHeading, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import DashboardNotification from 'in-components/DashboardNotification';
import Chart from 'in-components/Chart'
import MetricValue from 'in-components/MetricValue';
import { getLabel } from 'in-sdk/snapshot';

export default function MemcachedDashboard({ snapshot, timeframe }) {
  const snapshotId = snapshot.get('id');
  const maxBytes = snapshot.getIn(['data', 'limit_maxbytes']);
  const sensorConnectionStatus = snapshot.getIn(['data', 'sensorConnectionStatus']);
  if (sensorConnectionStatus !== 'OK') {
    return (
      <DashboardNotification type="info">
        {sensorConnectionStatus}
      </DashboardNotification>
    );
  }

  return (
    <div>
      <KpiSection>
        <KpiHeading>
          {getLabel(snapshot)}
        </KpiHeading>
        <KpiKeyValue label="Gets">
          <MetricValue snapshotId={snapshotId} metric="cmd_get" formatter={zeroDecimalPlaces} />
        </KpiKeyValue>
        <KpiKeyValue label="Sets">
          <MetricValue snapshotId={snapshotId} metric="cmd_set" formatter={zeroDecimalPlaces} />
        </KpiKeyValue>
        <KpiKeyValue label="Get hit ratio">
          <MetricValue snapshotId={snapshotId} metric="get_hit_rate" formatter={hitRateZeroDecimalPlaces} />
        </KpiKeyValue>
      </KpiSection>

      <DashboardSection title="Commands">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          margins={{
            left: 80
          }}
          y1={{
            metrics: ['cmd_get', 'cmd_set'],
            labels: ['Gets', 'Sets'],
            type: 'line',
            formatter: zeroDecimalPlaces
          }}
        />
      </DashboardSection>
      <DashboardSection title="Reads/Writes">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          margins={{
            left: 80
          }}
          y1={{
            metrics: ['bytes_read', 'bytes_write'],
            labels: ['Bytes reads', 'Bytes writes'],
            type: 'line',
            formatter: bytesZeroDecimalPlaces
          }}
        />
      </DashboardSection>
      <DashboardSection title="Get Hits/Misses">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          margins={{
            left: 80,
            right: 60
          }}
          y1={{
            metrics: ['get_hits', 'get_misses'],
            labels: ['Get hits', 'Get misses'],
            type: 'line',
            formatter: zeroDecimalPlaces
          }}
          y2={{
            min: 0,
            max: 1,
            metrics: ['get_hit_rate'],
            labels: ['Get hit ratio'],
            type: 'line',
            formatter: hitRateZeroDecimalPlaces
          }}
        />
      </DashboardSection>
      <DashboardSection title="Delete Hits/Misses">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          margins={{
            left: 80,
            right: 60
          }}
          y1={{
            metrics: ['delete_hits', 'delete_misses'],
            labels: ['Delete hits', 'Delete misses'],
            type: 'line',
            formatter: zeroDecimalPlaces
          }}
          y2={{
            min: 0,
            max: 1,
            metrics: ['delete_hit_rate'],
            labels: ['Delete hit ratio'],
            type: 'line',
            formatter: hitRateZeroDecimalPlaces
          }}
        />
      </DashboardSection>
      <DashboardSection title="Flush command">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          margins={{
            left: 80
          }}
          y1={{
            metrics: ['cmd_flush'],
            labels: ['Flush'],
            type: 'line',
            formatter: zeroDecimalPlaces
          }}
        />
      </DashboardSection>
      <DashboardSection title="Evictions">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          margins={{
            left: 80
          }}
          y1={{
            metrics: ['evictions'],
            labels: ['Evictions'],
            type: 'line',
            formatter: zeroDecimalPlaces
          }}
        />
      </DashboardSection>
      <DashboardSection title="Used bytes">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          margins={{
            left: 80
          }}
          y1={{
            max: maxBytes,
            metrics: ['bytes'],
            labels: ['Used bytes'],
            type: 'line',
            formatter: bytesZeroDecimalPlaces
          }}
        />
      </DashboardSection>
      <DashboardSection title="Connections">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          margins={{
            left: 80
          }}
          y1={{
            min: 0,
            metrics: ['conn_connected', 'conn_queued', 'conn_yields'],
            labels: ['Connected', 'Queued', 'Yields'],
            type: 'line',
            formatter: zeroDecimalPlaces
          }}
        />
      </DashboardSection>
    </div>
  );
}
