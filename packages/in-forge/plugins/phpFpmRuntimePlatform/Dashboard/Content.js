/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { twoDecimalPlaces, bytesTwoDecimalPlaces } from 'in-services/formatters/number';
import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { emptyList } from 'in-services/fixedImmutables';
import { t, Trans } from 'in-i18n';

export default function PhpFpmDashboard({ snapshot, timeConfig }) {
  const pools = snapshot.getIn(['data', 'worker_pools'], emptyList);
  if (pools.size === 0) {
    return (
      <DashboardNotification type="info">
        {t('in-forge:plugins.phpFpmRuntimePlatform.dashboard.noWorkerPoolsFound')}
      </DashboardNotification>
    );
  }

  return (
    <div>
      {pools.map(pool =>
        isStatusPathEnabled(snapshot, pool) ? (
          <WorkerPoolMetrics key={pool} snapshot={snapshot} timeConfig={timeConfig} pool={pool} />
        ) : (
          <DashboardNotification key={pool} type="info">
            <Trans
              i18nKey="in-forge:plugins.phpFpmRuntimePlatform.dashboard.workerPoolMetricsDashboardNotification"
              components={{
                code: <code />
              }}
              values={{ pool: pool }}
            />
          </DashboardNotification>
        )
      )}
    </div>
  );
}

function WorkerPoolMetrics({ snapshot, pool, timeConfig }) {
  const snapshotId = snapshot.get('id');
  const data = snapshot.get('data');

  return (
    <div key={pool}>
      <DashboardSection
        title={t('in-forge:plugins.phpFpmRuntimePlatform.dashboard.connectionsWithCount', {
          count: data.get('worker_pool.' + pool + '.pool')
        })}
      >
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: twoDecimalPlaces,
            metrics: [
              'worker_pool.' + pool + '.accepted_conn',
              'worker_pool.' + pool + '.slow_requests',
              'worker_pool.' + pool + '.connection_reset'
            ],
            labels: [
              t('in-forge:plugins.phpFpmRuntimePlatform.dashboard.acceptedConnections'),
              t('in-forge:plugins.phpFpmRuntimePlatform.dashboard.slowRequests'),
              t('in-forge:plugins.phpFpmRuntimePlatform.dashboard.connectionReset')
            ],
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
            labels: [
              t('in-forge:plugins.phpFpmRuntimePlatform.dashboard.listenQueue'),
              t('in-forge:plugins.phpFpmRuntimePlatform.dashboard.max'),
              t('in-forge:plugins.phpFpmRuntimePlatform.dashboard.length')
            ],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection
        title={t('in-forge:plugins.phpFpmRuntimePlatform.dashboard.processesWithCount', {
          count: data.get('worker_pool.' + pool + '.pool')
        })}
      >
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: twoDecimalPlaces,
            metrics: [
              'worker_pool.' + pool + '.idle_processes',
              'worker_pool.' + pool + '.active_processes',
              'worker_pool.' + pool + '.total_processes'
            ],
            labels: [
              t('in-forge:plugins.phpFpmRuntimePlatform.dashboard.idle'),
              t('in-forge:plugins.phpFpmRuntimePlatform.dashboard.active'),
              t('in-forge:plugins.phpFpmRuntimePlatform.dashboard.total')
            ],
            type: 'line'
          }}
          y2={{
            min: 0,
            formatter: twoDecimalPlaces,
            metrics: ['worker_pool.' + pool + '.max_active_processes', 'worker_pool.' + pool + '.max_children_reached'],
            labels: [
              t('in-forge:plugins.phpFpmRuntimePlatform.dashboard.maxActive'),
              t('in-forge:plugins.phpFpmRuntimePlatform.dashboard.maxChildren')
            ],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection
        title={t('in-forge:plugins.phpFpmRuntimePlatform.dashboard.resourcesWithCount', {
          count: data.get('worker_pool.' + pool + '.pool')
        })}
      >
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: bytesTwoDecimalPlaces,
            metrics: ['worker_pool.' + pool + '.total_memory'],
            labels: [t('in-forge:plugins.phpFpmRuntimePlatform.dashboard.memory')],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
    </div>
  );
}

function isStatusPathEnabled(snapshot, pool) {
  return snapshot.getIn(['data', 'worker_pool.' + pool + '.pm_status_path'], 'undefined') !== 'undefined';
}
