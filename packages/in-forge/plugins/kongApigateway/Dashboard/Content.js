/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { kongMonitoringEnabled } from 'in-services/featureFlags';
import { number } from 'in-services/formatters/number';
import SharedDictionary from './SharedDictionary';
import TotalConnections from './TotalConnections';
import WorkerLuaVM from './WorkerLuaVM';
import { t } from 'in-i18n';

export default function KongApiGatewayDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  const data = snapshot.get('data');

  if (kongMonitoringEnabled) {
    return (
      <div>
        <KpiSection>
          <KpiKeyValue label={t('in-forge:plugins.kongApigateway.kongDatastoreReachable')}>
            {data.get('datastoreReachable')}
          </KpiKeyValue>
          <KpiKeyValue label={t('in-forge:plugins.kongApigateway.errorsInLic')}>{data.get('errorsInLic')}</KpiKeyValue>
          <KpiKeyValue label={t('in-forge:plugins.kongApigateway.kongNgnixMetricErrors')}>
            {data.get('kongNgnixMetricErrors')}
          </KpiKeyValue>
          <KpiKeyValue label={t('in-forge:plugins.kongApigateway.totalNumberofDB')}>
            {data.get('totalNumberofDB')}
          </KpiKeyValue>
        </KpiSection>

        <DashboardSection title={t('in-forge:plugins.kongApigateway.dashboard.kongNginxTimers')}>
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              formatter: number.compact,
              metrics: ['nginxTimers.running', 'nginxTimers.pending'],
              labels: [t('in-forge:plugins.kongApigateway.running'), t('in-forge:plugins.kongApigateway.pending')],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <SharedDictionary snapshotId={snapshotId} timeConfig={timeConfig} />
        <WorkerLuaVM snapshotId={snapshotId} timeConfig={timeConfig} />
        <TotalConnections snapshotId={snapshotId} timeConfig={timeConfig} />
      </div>
    );
  }
  return <DashboardNotification>Cannot connect to kong server since it is closed beta version.</DashboardNotification>;
}
