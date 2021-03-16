/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import semver from 'semver';
import React from 'react';

import { msZeroDecimalPlaces, zeroDecimalPlaces, zeroDecimalPlacesPerSecond } from 'in-services/formatters/number';
import ExecutorsStreamingAppTableBeforeV200 from './ExecutorsStreamingAppTableBeforeV200';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import ExecutorsStreamingAppTable from './ExecutorsStreamingAppTable';
import { t } from 'in-i18n';

export default function StreamingAppContent({ snapshot, timeConfig }) {
  const version = snapshot.getIn(['data', 'version'], '2.0.0');

  return (
    <div>
      <DashboardSection title={t('in-forge:plugins.sparkApplication.dashboard.batches')}>
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            formatter: zeroDecimalPlacesPerSecond,
            metrics: ['completedBatches'],
            labels: [t('in-forge:plugins.sparkApplication.dashboard.completedBatchesPerSecond')],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.sparkApplication.dashboard.schedulingDelay')}>
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            formatter: msZeroDecimalPlaces,
            metrics: ['schedulingDelay'],
            labels: [t('in-forge:plugins.sparkApplication.dashboard.schedulingDelay')],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.sparkApplication.dashboard.totalDelay')}>
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            formatter: msZeroDecimalPlaces,
            metrics: ['totalDelay'],
            labels: [t('in-forge:plugins.sparkApplication.dashboard.totalDelay')],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.sparkApplication.dashboard.processingTime')}>
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            formatter: msZeroDecimalPlaces,
            metrics: ['processingTime'],
            labels: [t('in-forge:plugins.sparkApplication.dashboard.processingTime')],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      {semver.satisfies(version, '>=1.6.0') ? (
        <DashboardSection title={t('in-forge:plugins.sparkApplication.dashboard.outputOperations')}>
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              formatter: zeroDecimalPlaces,
              metrics: ['completedOutputOperations', 'failedOutputOperations'],
              labels: [
                t('in-forge:plugins.sparkApplication.dashboard.completedOutputOperations'),
                t('in-forge:plugins.sparkApplication.dashboard.failedOutputOperations')
              ],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      ) : null}
      <DashboardSection title={t('in-forge:plugins.sparkApplication.dashboard.inputRecords')}>
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            formatter: zeroDecimalPlaces,
            metrics: ['inputRecords'],
            labels: [t('in-forge:plugins.sparkApplication.dashboard.inputRecords')],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.sparkApplication.dashboard.receivers')}>
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            formatter: zeroDecimalPlaces,
            metrics: ['activeReceivers', 'activeReceivers'],
            labels: [
              t('in-forge:plugins.sparkApplication.dashboard.activeReceivers'),
              t('in-forge:plugins.sparkApplication.dashboard.inactiveReceivers')
            ],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      {semver.satisfies(version, '>=2.0.0') ? (
        <ExecutorsStreamingAppTable snapshot={snapshot} timeConfig={timeConfig} />
      ) : (
        <ExecutorsStreamingAppTableBeforeV200 snapshot={snapshot} timeConfig={timeConfig} />
      )}
    </div>
  );
}
