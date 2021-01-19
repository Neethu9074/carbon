/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { bytesZeroDecimalPlaces, zeroDecimalPlaces, hitRateZeroDecimalPlaces } from 'in-services/formatters/number';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import MetricValue from 'in-components/MetricValue';

export default function MemcachedDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  const maxBytes = snapshot.getIn(['data', 'limit_maxbytes']);
  const sensorConnectionStatus = snapshot.getIn(['data', 'sensorConnectionStatus']);
  if (sensorConnectionStatus !== 'OK') {
    return <DashboardNotification type="info">{sensorConnectionStatus}</DashboardNotification>;
  }

  return (
    <div>
      <KpiSection>
        <KpiKeyValue label="Gets">
          <MetricValue snapshotId={snapshotId} metric="cmd_get" formatter={zeroDecimalPlaces} />
        </KpiKeyValue>
        <KpiKeyValue label="Sets">
          <MetricValue snapshotId={snapshotId} metric="cmd_set" formatter={zeroDecimalPlaces} />
        </KpiKeyValue>
        <KpiKeyValue label="Get Hit Ratio">
          <MetricValue snapshotId={snapshotId} metric="get_hit_rate" formatter={hitRateZeroDecimalPlaces} />
        </KpiKeyValue>
      </KpiSection>

      <DashboardSection title="Commands">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['cmd_get', 'cmd_set'],
            labels: ['Gets', 'Sets'],
            type: 'line',
            formatter: zeroDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="Reads/Writes">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['bytes_read', 'bytes_write'],
            labels: ['Reads', 'Writes'],
            type: 'line',
            formatter: bytesZeroDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="Get Hits/Misses">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['get_hits', 'get_misses'],
            labels: ['Get Hits', 'Get Misses'],
            type: 'line',
            formatter: zeroDecimalPlaces
          }}
          y2={{
            min: 0,
            max: 1,
            metrics: ['get_hit_rate'],
            labels: ['Get Hit Ratio'],
            type: 'line',
            formatter: hitRateZeroDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="Delete Hits/Misses">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['delete_hits', 'delete_misses'],
            labels: ['Delete Hits', 'Delete Misses'],
            type: 'line',
            formatter: zeroDecimalPlaces
          }}
          y2={{
            min: 0,
            max: 1,
            metrics: ['delete_hit_rate'],
            labels: ['Delete Hit Ratio'],
            type: 'line',
            formatter: hitRateZeroDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="Flush Command">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['cmd_flush'],
            labels: ['Flush'],
            type: 'line',
            formatter: zeroDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="Evictions">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['evictions'],
            labels: ['Evictions'],
            type: 'line',
            formatter: zeroDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="Used Bytes">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            max: maxBytes,
            metrics: ['bytes'],
            labels: ['Used Bytes'],
            type: 'line',
            formatter: bytesZeroDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="Connections">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['conn_connected', 'conn_queued', 'conn_yields'],
            labels: ['Connected', 'Queued', 'Yields'],
            type: 'line',
            formatter: zeroDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
    </div>
  );
}
