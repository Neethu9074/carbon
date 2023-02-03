/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import JgroupsDefaultThreadPoolTableV8 from './JgroupsDefaultThreadPoolTableV8.js';
import JgroupsDefaultThreadPoolTable from './JgroupsDefaultThreadPoolTable.js';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import JgroupsTimerThreadPoolTableV8 from './JgroupsTimerThreadPoolTableV8.js';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import CacheLatencyThroughputTable from './CacheLatencyThroughputTable.js';
import JgroupsTimerThreadPoolTable from './JgroupsTimerThreadPoolTable.js';
import JgroupsOOBThreadPoolTable from './JgroupsOOBThreadPoolTable.js';
import CacheHitsAndMissesTable from './CacheHitsAndMissesTable.js';
import { zeroDecimalPlaces } from 'in-services/formatters/number';
import CacheOtherStatsTable from './CacheOtherStatsTable.js';
import CacheManagersTable from './CacheManagersTable.js';
import { t } from 'in-i18n';

export default function JbossDataGridDashboard({ snapshot, timeConfig }) {
  const major = snapshot.getIn(['data', 'jdgServerVersion.major'], 0);

  if (major >= 8) {
    return (
      <div>
        <JgroupsTimerThreadPoolTableV8 snapshot={snapshot} timeConfig={timeConfig} />
        <JgroupsDefaultThreadPoolTableV8 snapshot={snapshot} timeConfig={timeConfig} />
        <CacheLatencyThroughputTable snapshot={snapshot} timeConfig={timeConfig} />
        <CacheHitsAndMissesTable snapshot={snapshot} timeConfig={timeConfig} />
        <CacheOtherStatsTable snapshot={snapshot} timeConfig={timeConfig} />
        <CacheManagersTable snapshot={snapshot} timeConfig={timeConfig} />
        <DashboardSection title={t('in-forge:plugins.jbossDataGrid.hotRodConnections')}>
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              formatter: zeroDecimalPlaces,
              metrics: ['hotRod.numberOfLocalConnections', 'hotRod.numberOfGlobalConnections'],
              labels: [
                t('in-forge:plugins.jbossDataGrid.numberOfLocalConnections'),
                t('in-forge:plugins.jbossDataGrid.numberOfGlobalConnections')
              ],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </div>
    );
  } else {
    return (
      <div>
        <JgroupsOOBThreadPoolTable snapshot={snapshot} timeConfig={timeConfig} />
        <JgroupsTimerThreadPoolTable snapshot={snapshot} timeConfig={timeConfig} />
        <JgroupsDefaultThreadPoolTable snapshot={snapshot} timeConfig={timeConfig} />
        <CacheLatencyThroughputTable snapshot={snapshot} timeConfig={timeConfig} />
        <CacheHitsAndMissesTable snapshot={snapshot} timeConfig={timeConfig} />
        <CacheOtherStatsTable snapshot={snapshot} timeConfig={timeConfig} />
        <CacheManagersTable snapshot={snapshot} timeConfig={timeConfig} />
        <DashboardSection title={t('in-forge:plugins.jbossDataGrid.hotRodConnections')}>
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              formatter: zeroDecimalPlaces,
              metrics: ['hotRod.numberOfLocalConnections', 'hotRod.numberOfGlobalConnections'],
              labels: [
                t('in-forge:plugins.jbossDataGrid.numberOfLocalConnections'),
                t('in-forge:plugins.jbossDataGrid.numberOfGlobalConnections')
              ],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </div>
    );
  }
}
