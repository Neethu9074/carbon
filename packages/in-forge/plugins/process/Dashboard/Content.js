/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { bytesTwoDecimalPlaces, percentageZeroDecimalPlaces, number, siPrefix } from 'in-services/formatters/number';
import ProcessCompanionMetrics from 'in-sdk/components/dashboard/ProcessCompanionMetrics';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { supportsOpenFiles } from 'in-forge/plugins/host/hostUtils';
import ProcessesList from 'in-forge/plugins/process/ProcessesList';
import getHostSnapshotId from 'in-subscription/getHostSnapshotId';
import { getSnapshot } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

export default connectTo(
  ({ snapshot }) => ({ hostSnapshot: getHostSnapshotId(snapshot).flatMap(getSnapshot) }),

  function ProcessDashboard({ snapshot, timeConfig, hostSnapshot }) {
    const snapshotId = snapshot.get('id');
    const data = snapshot.get('data');
    return (
      <div>
        <DashboardSection title={t('in-forge:plugins.process.dashboard.cpuUsage')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['cpu.user', 'cpu.sys'],
              labels: [t('in-forge:plugins.process.dashboard.user'), t('in-forge:plugins.process.dashboard.system')],
              formatter: percentageZeroDecimalPlaces,
              type: 'stackedArea'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>

        <DashboardSection title={t('in-forge:plugins.process.dashboard.memory')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: bytesTwoDecimalPlaces,
              metrics: ['mem.virtual', 'mem.resident', 'mem.share'],
              labels: [
                t('in-forge:plugins.process.dashboard.virtual'),
                t('in-forge:plugins.process.dashboard.resident'),
                t('in-forge:plugins.process.dashboard.share')
              ],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>

        {hostSnapshot && supportsOpenFiles(hostSnapshot) && (
          <DashboardSection title={t('in-forge:plugins.process.dashboard.openFiles')}>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: siPrefix.compact,
                tooltipFormatter: number.compact,
                metrics: ['openFiles.current'],
                labels: [t('in-forge:plugins.process.dashboard.current')],
                type: 'line'
              }}
              y2={{
                min: 0,
                max: 1,
                metrics: ['openFiles.used'],
                labels: [t('in-forge:plugins.process.dashboard.used')],
                formatter: percentageZeroDecimalPlaces,
                type: 'line'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </DashboardSection>
        )}

        {data.get('ctx_switches_enabled') ? (
          <DashboardSection title={t('in-forge:plugins.process.dashboard.numberOfContextSwitches')}>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: ['ctx_switches.voluntary', 'ctx_switches.nonvoluntary'],
                labels: [
                  t('in-forge:plugins.process.dashboard.voluntary'),
                  t('in-forge:plugins.process.dashboard.nonvoluntary')
                ],
                formatter: number.compact,
                type: 'line'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </DashboardSection>
        ) : null}

        <ProcessCompanionMetrics snapshotId={snapshotId} timeConfig={timeConfig} />
        <ProcessesList snapshotId={snapshotId} />
      </div>
    );
  }
);
