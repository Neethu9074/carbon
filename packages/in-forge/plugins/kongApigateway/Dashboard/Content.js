/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { yesOrNo } from 'in-services/formatters/boolean';
import { number } from 'in-services/formatters/number';
import TotalHttpRequest from './TotalHttpRequest';
import SharedDictionary from './SharedDictionary';
import TotalConnections from './TotalConnections';
import TotalRequest from './TotalRequest';
import WorkerLuaVM from './WorkerLuaVM';
import BandWidth from './BandWidth';
import { t } from 'in-i18n';

export default function KongApiGatewayDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  const data = snapshot.get('data');

  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.kongApigateway.database')}>{data.get('database')}</KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.kongApigateway.kongDatastoreReachable')}>
          {yesOrNo(data.get('datastoreReachable'))}
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.kongApigateway.totalNumberofDB')}>
          {data.get('totalNumberofDB')}
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.kongApigateway.kongDbEntitiesTotal')}>
          {data.get('kongDbEntitiesTotal')}
        </KpiKeyValue>
      </KpiSection>

      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.kongApigateway.kongEnterpriseLicenseErrors')}>
          {data.get('kongEnterpriseLicenseErrors')}
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.kongApigateway.kongNgnixMetricErrors')}>
          {data.get('kongNgnixMetricErrors')}
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.kongApigateway.errorsInLic')}>{data.get('errorsInLic')}</KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.kongApigateway.workerStateUpdateFrequency')}>
          {data.get('workerStateUpdateFrequency')}
        </KpiKeyValue>
      </KpiSection>

      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.kongApigateway.prometheusEnabled')}>
          {yesOrNo(data.get('prometheusEnabled'))}
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.kongApigateway.workerConsistency')}>
          {data.get('workerConsistency')}
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

      <DashboardSection title={t('in-forge:plugins.kongApigateway.totalTraffic')}>
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            formatter: number.compact,
            metrics: [
              'totalTraffic.status2xx',
              'totalTraffic.status3xx',
              'totalTraffic.status4xx',
              'totalTraffic.status5xx'
            ],
            labels: [
              t('in-forge:plugins.kongApigateway.status2xx'),
              t('in-forge:plugins.kongApigateway.status3xx'),
              t('in-forge:plugins.kongApigateway.status4xx'),
              t('in-forge:plugins.kongApigateway.status5xx')
            ],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <SharedDictionary snapshotId={snapshotId} timeConfig={timeConfig} />
      <WorkerLuaVM snapshotId={snapshotId} timeConfig={timeConfig} />
      <TotalConnections snapshotId={snapshotId} timeConfig={timeConfig} />
      <TotalRequest snapshotId={snapshotId} timeConfig={timeConfig} />
      <BandWidth snapshotId={snapshotId} timeConfig={timeConfig} />
      <TotalHttpRequest snapshotId={snapshotId} timeConfig={timeConfig} />
    </div>
  );
}
