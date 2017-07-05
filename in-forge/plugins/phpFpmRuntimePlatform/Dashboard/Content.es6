import React from 'react';

import { twoDecimalPlaces, bytesTwoDecimalPlaces } from 'in-services/formatters/number';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import DashboardNotification from 'in-components/DashboardNotification';
import ChartWithLegend from 'in-components/ChartWithLegend';
import { emptyList } from 'in-services/fixedImmutables';

export default function PhpFpmDashboard({ snapshot, timeframe }) {
  const pools = snapshot.getIn(['data', 'worker_pools'], emptyList);
  if (pools.size === 0) {
    return (
      <span>
        No Worker Pools found
      </span>
    );
  }

  return (
    <div>
      {pools.map(
        pool =>
          isStatusPathEnabled(snapshot, pool)
            ? <WorkerPoolMetrics key={pool} snapshot={snapshot} timeframe={timeframe} pool={pool} />
            : <DashboardNotification key={pool} type="info">
                In order to monitor the worker pool {pool}, you need to
                enable <code>pm.status_path</code> in your PHP-FPM config.
              </DashboardNotification>
      )}
    </div>
  );
}

function WorkerPoolMetrics({ snapshot, pool, timeframe }) {
  const snapshotId = snapshot.get('id');
  const data = snapshot.get('data');

  return (
    <div key={pool}>
      <DashboardSection title={'Connections (' + data.get('worker_pool.' + pool + '.pool') + ')'}>
        <ChartWithLegend
          snapshotId={snapshotId}
          timeframe={timeframe}
          margins={{
            left: 90,
            right: 60
          }}
          y1={{
            min: 0,
            formatter: twoDecimalPlaces,
            metrics: [
              'worker_pool.' + pool + '.accepted_conn',
              'worker_pool.' + pool + '.slow_requests',
              'worker_pool.' + pool + '.connection_reset'
            ],
            labels: ['Accepted Connections', 'Slow Requests', 'Connection Reset'],
            type: 'line'
          }}
          y2={{
            min: 0,
            formatter: twoDecimalPlaces,
            metrics: [
              'worker_pool.' + pool + '.listen_queue',
              'worker_pool.' + pool + '.max_listen_queue',
              'worker_pool.' + pool + '.listen_queue_len'
            ],
            labels: ['Listen Queue', 'Max', 'Length'],
            type: 'line'
          }}
        />
      </DashboardSection>
      <DashboardSection title={'Processes (' + data.get('worker_pool.' + pool + '.pool') + ')'}>
        <ChartWithLegend
          snapshotId={snapshotId}
          timeframe={timeframe}
          margins={{
            left: 90,
            right: 60
          }}
          y1={{
            min: 0,
            formatter: twoDecimalPlaces,
            metrics: [
              'worker_pool.' + pool + '.idle_processes',
              'worker_pool.' + pool + '.active_processes',
              'worker_pool.' + pool + '.total_processes'
            ],
            labels: ['Idle', 'Active', 'Total'],
            type: 'line'
          }}
          y2={{
            min: 0,
            formatter: twoDecimalPlaces,
            metrics: ['worker_pool.' + pool + '.max_active_processes', 'worker_pool.' + pool + '.max_children_reached'],
            labels: ['Max Active', 'Max Children'],
            type: 'line'
          }}
        />
      </DashboardSection>
      <DashboardSection title={'Resources (' + data.get('worker_pool.' + pool + '.pool') + ')'}>
        <ChartWithLegend
          snapshotId={snapshotId}
          timeframe={timeframe}
          margins={{
            left: 90
          }}
          y1={{
            min: 0,
            formatter: bytesTwoDecimalPlaces,
            metrics: ['worker_pool.' + pool + '.total_memory'],
            labels: ['Memory'],
            type: 'line'
          }}
        />
      </DashboardSection>
    </div>
  );
}

function isStatusPathEnabled(snapshot, pool) {
  return snapshot.getIn(['data', 'worker_pool.' + pool + '.pm_status_path'], 'undefined') !== 'undefined';
}
