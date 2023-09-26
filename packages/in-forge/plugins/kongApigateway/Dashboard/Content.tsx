/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { TimeConfig } from '@instana/types';

// @ts-expect-error needs TS migration
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import KongUpstreamLatencyRoute from 'in-forge/plugins/kongApigateway/Dashboard/KongUpstreamLatencyRoute';
import KongKongLatencyRoute from 'in-forge/plugins/kongApigateway/Dashboard/KongKongLatencyRoute';
import KongUpstreamLatency from 'in-forge/plugins/kongApigateway/Dashboard/KongUpstreamLatency';
import KongRequestLatency from 'in-forge/plugins/kongApigateway/Dashboard/KongRequestLatency';
import TotalHttpRequest from 'in-forge/plugins/kongApigateway/Dashboard/TotalHttpRequest';
import TotalConnections from 'in-forge/plugins/kongApigateway/Dashboard/TotalConnections';
import SharedDictionary from 'in-forge/plugins/kongApigateway/Dashboard/SharedDictionary';
import KongKongLatency from 'in-forge/plugins/kongApigateway/Dashboard/KongKongLatency';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import TotalRequest from 'in-forge/plugins/kongApigateway/Dashboard/TotalRequest';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import WorkerLuaVM from 'in-forge/plugins/kongApigateway/Dashboard/WorkerLuaVM';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import BandWidth from 'in-forge/plugins/kongApigateway/Dashboard/BandWidth';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { yesOrNo } from 'in-services/formatters/boolean';
import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

interface KongApiGatewayDashboardProps {
  snapshot: SnapshotData;
  timeConfig: TimeConfig;
}

const KongApiGatewayDashboard: React.FC<KongApiGatewayDashboardProps> = ({ snapshot, timeConfig }) => {
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
      </KpiSection>

      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.kongApigateway.kongDbEntitiesTotal')}>
          {data.get('kongDbEntitiesTotal')}
        </KpiKeyValue>

        <KpiKeyValue label={t('in-forge:plugins.kongApigateway.kongNgnixMetricErrors')}>
          {data.get('kongNgnixMetricErrors')}
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.kongApigateway.errorsInLic')}>{data.get('errorsInLic')}</KpiKeyValue>
      </KpiSection>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.kongApigateway.prometheusEnabled')}>
          {yesOrNo(data.get('prometheusEnabled'))}
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.kongApigateway.workerConsistency')}>
          {data.get('workerConsistency')}
        </KpiKeyValue>

        <KpiKeyValue label={t('in-forge:plugins.kongApigateway.workerStateUpdateFrequency')}>
          {data.get('workerStateUpdateFrequency')}
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
      <BandWidth snapshotId={snapshotId} timeConfig={timeConfig} />
      <SharedDictionary snapshotId={snapshotId} timeConfig={timeConfig} />
      <TotalConnections snapshotId={snapshotId} timeConfig={timeConfig} />
      <TotalHttpRequest snapshotId={snapshotId} timeConfig={timeConfig} />
      <TotalRequest snapshotId={snapshotId} timeConfig={timeConfig} />
      <KongKongLatency snapshotId={snapshotId} timeConfig={timeConfig} />
      <KongKongLatencyRoute snapshotId={snapshotId} timeConfig={timeConfig} />
      <KongRequestLatency snapshotId={snapshotId} timeConfig={timeConfig} />
      <WorkerLuaVM snapshotId={snapshotId} timeConfig={timeConfig} />
      <KongUpstreamLatency snapshotId={snapshotId} timeConfig={timeConfig} />
      <KongUpstreamLatencyRoute snapshotId={snapshotId} timeConfig={timeConfig} />
    </div>
  );
};

export default KongApiGatewayDashboard;
