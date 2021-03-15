/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import {
  bytesTwoDecimalPlaces,
  percentagePlainZeroDecimalPlaces,
  zeroDecimalPlaces
} from 'in-services/formatters/number';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { t } from 'in-i18n';

export default function F5Dashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <DashboardSection title={t('in-forge:plugins.f5.dashboard.memory')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            max: snapshot.getIn(['data', 'memTotal']),
            formatter: bytesTwoDecimalPlaces,
            metrics: ['memFree'],
            labels: [t('in-forge:plugins.f5.dashboard.free')],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.f5.dashboard.cpuUsage')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['cpuUsed'],
            labels: [t('in-forge:plugins.f5.dashboard.cpuUsage')],
            formatter: percentagePlainZeroDecimalPlaces,
            type: 'stackedArea'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.f5.dashboard.httpRequests')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['httpRequests'],
            labels: [t('in-forge:plugins.f5.dashboard.httpRequests')],
            formatter: zeroDecimalPlaces,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
    </div>
  );
}
