/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import {
  number,
  percentageTwoDecimalPlaces,
  msZeroDecimalPlaces,
  bytesPerSecondZeroDecimalPlaces
} from 'in-services/formatters/number';
import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { healthFormatter } from 'in-forge/plugins/ceph/formatters';
import PoolTable from 'in-forge/plugins/ceph/Dashboard/PoolTable';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

export default function CephDashboard({ snapshot, timeConfig }) {
  const sensorStatusCode = snapshot.getIn(['data', 'sensorStatusCode'], 1);

  if (sensorStatusCode !== 1) {
    return (
      <DashboardNotification type="info">
        Agent could not connect to Ceph cluster, Ceph executable not found. Please set &apos;ceph-executable-path&apos;
        property to the path of Ceph executable in configuration.
      </DashboardNotification>
    );
  }

  const snapshotId = snapshot.get('id');
  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.ceph.dashboard.labelOverallStatus')}>
          <MetricValue snapshotId={snapshotId} metric="overall_status" formatter={healthFormatter} />
        </KpiKeyValue>
      </KpiSection>
      <DashboardSection title={t('in-forge:plugins.ceph.dashboard.titleMonitors')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['num_mons', 'num_active_mons'],
            labels: [t('in-forge:plugins.ceph.dashboard.labelAll'), t('in-forge:plugins.ceph.dashboard.labelActive')],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.ceph.dashboard.titleOSDStatus')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['num_osds', 'num_up_osds', 'num_in_osds'],
            labels: [
              t('in-forge:plugins.ceph.dashboard.labelTotal'),
              t('in-forge:plugins.ceph.dashboard.labelUp'),
              t('in-forge:plugins.ceph.dashboard.labelIn')
            ],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.ceph.dashboard.titleLatency')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['commit_latency_ms', 'apply_latency_ms'],
            labels: [t('in-forge:plugins.ceph.dashboard.labelCommit'), t('in-forge:plugins.ceph.dashboard.labelApply')],
            type: 'line',
            formatter: msZeroDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.ceph.dashboard.titleUnhealthyOSDs')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['num_near_full_osds', 'num_full_osds'],
            labels: [
              t('in-forge:plugins.ceph.dashboard.labelNearFull'),
              t('in-forge:plugins.ceph.dashboard.labelFull')
            ],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.ceph.dashboard.titlePlacementGroups')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['num_pgs', 'num_active_clean'],
            labels: [
              t('in-forge:plugins.ceph.dashboard.labelAll'),
              t('in-forge:plugins.ceph.dashboard.labelActiveClean')
            ],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.ceph.dashboard.titlePools')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['num_pools'],
            labels: [t('in-forge:plugins.ceph.dashboard.labelPools')],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.ceph.dashboard.titleObjects')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['num_objects'],
            labels: [t('in-forge:plugins.ceph.dashboard.labelObjects')],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.ceph.dashboard.titleIO')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['read_bytes_sec'],
            labels: [t('in-forge:plugins.ceph.dashboard.labelRead')],
            type: 'line',
            formatter: bytesPerSecondZeroDecimalPlaces
          }}
          y2={{
            min: 0,
            metrics: ['write_bytes_sec'],
            labels: [t('in-forge:plugins.ceph.dashboard.labelWrite')],
            type: 'line',
            formatter: bytesPerSecondZeroDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.ceph.dashboard.titleOPS')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['read_op_per_sec'],
            labels: [t('in-forge:plugins.ceph.dashboard.labelRead')],
            type: 'line',
            formatter: number.compact
          }}
          y2={{
            min: 0,
            metrics: ['write_op_per_sec'],
            labels: [t('in-forge:plugins.ceph.dashboard.labelWrite')],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.ceph.dashboard.titleCapacity')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            max: 1,
            metrics: ['aggregate_pct_used'],
            labels: [t('in-forge:plugins.ceph.dashboard.labelCapacity')],
            type: 'line',
            formatter: percentageTwoDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <PoolTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}
