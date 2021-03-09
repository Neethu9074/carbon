/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { zeroDecimalPlaces } from 'in-services/formatters/number';
import LdapConnectorsTable from './LdapConnectorsTable';
import RecentChangesTable from './RecentChangesTable';
import { t } from 'in-i18n';

export default function PingDirectoryDashboard({ snapshot, timeConfig }) {
  return (
    <div>
      <DashboardSection title={t('in-forge:plugins.pingDirectory.dashboard.activity')}>
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            formatter: zeroDecimalPlaces,
            metrics: ['operations_in_progress', 'searches_in_progress'],
            labels: [
              t('in-forge:plugins.pingDirectory.dashboard.operations'),
              t('in-forge:plugins.pingDirectory.dashboard.searches')
            ],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.pingDirectory.dashboard.connections')}>
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            formatter: zeroDecimalPlaces,
            metrics: ['established_connections', 'max_concurrent_connections', 'total_connections_since_startup'],
            labels: [
              t('in-forge:plugins.pingDirectory.dashboard.established'),
              t('in-forge:plugins.pingDirectory.dashboard.maxConcurrent'),
              t('in-forge:plugins.pingDirectory.dashboard.total')
            ],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.pingDirectory.dashboard.descriptors')}>
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            formatter: zeroDecimalPlaces,
            metrics: ['available_file_descriptors', 'open_file_descriptors', 'max_file_descriptors'],
            labels: [
              t('in-forge:plugins.pingDirectory.dashboard.available'),
              t('in-forge:plugins.pingDirectory.dashboard.open'),
              t('in-forge:plugins.pingDirectory.dashboard.max')
            ],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.pingDirectory.dashboard.failedOperations')}>
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            formatter: zeroDecimalPlaces,
            metrics: [
              'all_ops_failed',
              'add_op_failed',
              'bind_op_failed',
              'compare_op_failed',
              'delete_op_failed',
              'extended_op_failed',
              'modify_op_failed',
              'search_op_failed'
            ],
            labels: [
              t('in-forge:plugins.pingDirectory.dashboard.all'),
              t('in-forge:plugins.pingDirectory.dashboard.add'),
              t('in-forge:plugins.pingDirectory.dashboard.bind'),
              t('in-forge:plugins.pingDirectory.dashboard.compare'),
              t('in-forge:plugins.pingDirectory.dashboard.delete'),
              t('in-forge:plugins.pingDirectory.dashboard.extended'),
              t('in-forge:plugins.pingDirectory.dashboard.modify'),
              t('in-forge:plugins.pingDirectory.dashboard.search')
            ],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.pingDirectory.dashboard.totalOperations')}>
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            formatter: zeroDecimalPlaces,
            metrics: [
              'all_ops_total',
              'add_op_total',
              'bind_op_total',
              'compare_op_total',
              'delete_op_total',
              'extended_op_total',
              'modify_op_total',
              'search_op_total'
            ],
            labels: [
              t('in-forge:plugins.pingDirectory.dashboard.all'),
              t('in-forge:plugins.pingDirectory.dashboard.add'),
              t('in-forge:plugins.pingDirectory.dashboard.bind'),
              t('in-forge:plugins.pingDirectory.dashboard.compare'),
              t('in-forge:plugins.pingDirectory.dashboard.delete'),
              t('in-forge:plugins.pingDirectory.dashboard.extended'),
              t('in-forge:plugins.pingDirectory.dashboard.modify'),
              t('in-forge:plugins.pingDirectory.dashboard.search')
            ],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <LdapConnectorsTable snapshot={snapshot} timeConfig={timeConfig} />
      <RecentChangesTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}
