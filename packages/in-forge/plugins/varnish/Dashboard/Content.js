/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import {
  twoDecimalPlaces,
  zeroDecimalPlaces,
  bytesZeroDecimalPlaces,
  hitRateZeroDecimalPlaces
} from 'in-services/formatters/number';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import MseTable from 'in-forge/plugins/varnish/Dashboard/MseTable';
import MetricValue from 'in-components/MetricValue';

export default function VarnishDashboard({ snapshot, timeConfig }) {
  const data = snapshot.get('data');
  const snapshotId = snapshot.get('id');
  const hasMse = data.get('mse');
  return (
    <div>
      <KpiSection>
        <KpiKeyValue label="Requests">
          <MetricValue snapshotId={snapshotId} metric="client_req" formatter={zeroDecimalPlaces} />
        </KpiKeyValue>
        <KpiKeyValue label="Cache Hit Rate">
          <MetricValue snapshotId={snapshotId} metric="cache_hit_rate" formatter={hitRateZeroDecimalPlaces} />
        </KpiKeyValue>
      </KpiSection>
      <DashboardSection title="Client">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['sess_conn', 'client_req', 'sess_dropped'],
            labels: [
              'Accepted client connections',
              'Received client requests',
              'Connections dropped due to a full queue'
            ],
            formatter: zeroDecimalPlaces,
            tooltipFormatter: twoDecimalPlaces,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="Cache">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['cache_hit', 'cache_miss', 'cache_hitpass'],
            labels: ['Cache Hits', 'Cache Misses', 'Hits pass file'],
            type: 'line'
          }}
          y2={{
            min: 0,
            max: 1,
            metrics: ['cache_hit_rate'],
            labels: ['Cache hit rate'],
            type: 'line',
            formatter: hitRateZeroDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="Cached objects">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['n_expired', 'n_lru_nuked'],
            labels: ['Expired objects', 'Nuked Objects'],
            type: 'line',
            formatter: zeroDecimalPlaces,
            tooltipFormatter: twoDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="Threads">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: [
              'threads',
              'threads_created',
              'threads_failed',
              'threads_limited',
              'thread_queue_len',
              'sess_queued'
            ],
            labels: ['Threads', 'Created', 'Failed', 'Limited', 'Queue', 'Queued requests'],
            type: 'line',
            formatter: zeroDecimalPlaces
          }}
          y2={{
            min: 0,
            metrics: ['threads'],
            labels: ['Threads'],
            type: 'line',
            formatter: zeroDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="Backend">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: [
              'backend_conn',
              'backend_recycle',
              'backend_reuse',
              'backend_fail',
              'backend_unhealthy',
              'backend_busy',
              'backend_req'
            ],
            labels: ['Connections', 'Recycled', 'Reused', 'Idle closed', 'Unhealthy', 'Busy', 'Requests'],
            type: 'line',
            formatter: zeroDecimalPlaces,
            tooltipFormatter: twoDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      {hasMse ? (
        <DashboardSection title="Massive Storage Engine">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['mse_bytes'],
              labels: ['Used Bytes'],
              type: 'line',
              formatter: bytesZeroDecimalPlaces
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
          <MseTable snapshot={snapshot} timeConfig={timeConfig} />
        </DashboardSection>
      ) : null}
    </div>
  );
}
