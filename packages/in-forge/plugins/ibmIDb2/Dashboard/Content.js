/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import DashboardSection from '../../../../in-sdk/components/dashboard/DashboardSection';
import PluginDashboardsMarkerLanes from '../../../PluginDashboardsMarkerLanes';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { bytes, number, percentage } from 'in-services/formatters/number';
import Columize from 'in-sdk/components/dashboard/Columize';
import { t } from '../../../../in-i18n';

export default function IbmIDb2Dashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  const collectionServicesRunning = snapshot.getIn(['data', 'collectionServicesRunning']);
  return (
    collectionServicesRunning && (
      <div>
        <DashboardSection title={t('in-forge:plugins.ibmIDb2.dashboard.charts.activeQueries.name')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['activeQueries'],
              labels: [t('in-forge:plugins.ibmIDb2.dashboard.charts.activeQueries.count')],
              formatter: number.compact,
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.ibmIDb2.dashboard.charts.logicalOperations.name')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['logicDatabaseReads', 'logicDatabaseWrites'],
              labels: [
                t('in-forge:plugins.ibmIDb2.dashboard.charts.logicalOperations.reads'),
                t('in-forge:plugins.ibmIDb2.dashboard.charts.logicalOperations.writes')
              ],
              formatter: number.compact,
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <Columize>
          <DashboardSection title={t('in-forge:plugins.ibmIDb2.dashboard.charts.asynchronousOperations.name')}>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: ['asyncDatabaseReads', 'asyncDatabaseWrites'],
                labels: [
                  t('in-forge:plugins.ibmIDb2.dashboard.charts.asynchronousOperations.reads'),
                  t('in-forge:plugins.ibmIDb2.dashboard.charts.asynchronousOperations.writes')
                ],
                formatter: number.compact,
                type: 'line'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </DashboardSection>
          <DashboardSection title={t('in-forge:plugins.ibmIDb2.dashboard.charts.synchronousOperations.name')}>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: ['syncDatabaseReads', 'syncDatabaseWrites'],
                labels: [
                  t('in-forge:plugins.ibmIDb2.dashboard.charts.synchronousOperations.reads'),
                  t('in-forge:plugins.ibmIDb2.dashboard.charts.synchronousOperations.writes')
                ],
                formatter: number.compact,
                type: 'line'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </DashboardSection>
        </Columize>
        <DashboardSection title={t('in-forge:plugins.ibmIDb2.dashboard.charts.databaseOperations.name')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['commits', 'rollbacks', 'miscellaneous'],
              labels: [
                t('in-forge:plugins.ibmIDb2.dashboard.charts.databaseOperations.commits'),
                t('in-forge:plugins.ibmIDb2.dashboard.charts.databaseOperations.rollbacks'),
                t('in-forge:plugins.ibmIDb2.dashboard.charts.databaseOperations.miscellaneous')
              ],
              formatter: number.compact,
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.ibmIDb2.dashboard.charts.planCachePlans.name')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['planCachePlans'],
              labels: [t('in-forge:plugins.ibmIDb2.dashboard.charts.planCachePlans.count')],
              formatter: number.compact,
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.ibmIDb2.dashboard.charts.planCache.name')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['planCacheSize', 'planCacheSizeLimit'],
              labels: [
                t('in-forge:plugins.ibmIDb2.dashboard.charts.planCache.size'),
                t('in-forge:plugins.ibmIDb2.dashboard.charts.planCache.limit')
              ],
              formatter: bytes.detailed,
              type: 'line'
            }}
            y2={{
              min: 0,
              metrics: ['planCacheSizeThreshold'],
              labels: [t('in-forge:plugins.ibmIDb2.dashboard.charts.planCache.threshold')],
              formatter: percentage.detailed,
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.ibmIDb2.dashboard.charts.sqlCursor.name')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['cursorCount', 'cursorReuse'],
              labels: [
                t('in-forge:plugins.ibmIDb2.dashboard.charts.sqlCursor.count'),
                t('in-forge:plugins.ibmIDb2.dashboard.charts.sqlCursor.reuse')
              ],
              formatter: number.compact,
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </div>
    )
  );
}
