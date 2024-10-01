/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { TimeConfig } from '@instana/types';

import {
  number,
  percentage,
  bytesTwoDecimalPlaces,
  timeByMillisZeroDecimalPlaces
} from 'in-services/formatters/number';
// @ts-expect-error needs TS migration
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import KongUpstreamLatencyRoute from 'in-forge/plugins/kongApigateway/Dashboard/KongUpstreamLatencyRoute';
import KongRequestLatencyRoute from 'in-forge/plugins/kongApigateway/Dashboard/KongRequestLatencyRoute';
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
import Columize from 'in-sdk/components/dashboard/Columize';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { yesOrNo } from 'in-services/formatters/boolean';
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
        {data.get('database') != null && (
          <KpiKeyValue label={t('in-forge:plugins.kongApigateway.database')}>{data.get('database')}</KpiKeyValue>
        )}
        {data.get('datastoreReachable') != null && (
          <KpiKeyValue label={t('in-forge:plugins.kongApigateway.kongDatastoreReachable')}>
            {yesOrNo(data.get('datastoreReachable'))}
          </KpiKeyValue>
        )}
        {data.get('kongDbEntitiesTotal') != null && (
          <KpiKeyValue label={t('in-forge:plugins.kongApigateway.totalNumberofDB')}>
            {data.get('kongDbEntitiesTotal')}
          </KpiKeyValue>
        )}
      </KpiSection>

      <KpiSection>
        {data.get('kongDbEntityCountErrors') != null && (
          <KpiKeyValue label={t('in-forge:plugins.kongApigateway.kongDbEntitiesTotal')}>
            {data.get('kongDbEntityCountErrors')}
          </KpiKeyValue>
        )}
        {data.get('kongNginxMetricErrorsTotal') != null && (
          <KpiKeyValue label={t('in-forge:plugins.kongApigateway.kongNgnixMetricErrors')}>
            {String(data.get('kongNginxMetricErrorsTotal'))}
          </KpiKeyValue>
        )}
        {data.get('kongEnterpriseLicenseErrors') != null && (
          <KpiKeyValue label={t('in-forge:plugins.kongApigateway.errorsInLic')}>
            {data.get('kongEnterpriseLicenseErrors')}
          </KpiKeyValue>
        )}
      </KpiSection>

      <KpiSection>
        {data.get('prometheusEnabled') != null && (
          <KpiKeyValue label={t('in-forge:plugins.kongApigateway.prometheusEnabled')}>
            {yesOrNo(data.get('prometheusEnabled'))}
          </KpiKeyValue>
        )}
        {data.get('workerConsistency') != null && (
          <KpiKeyValue label={t('in-forge:plugins.kongApigateway.workerConsistency')}>
            {data.get('workerConsistency')}
          </KpiKeyValue>
        )}
        {data.get('workerStateUpdateFrequency') != null && (
          <KpiKeyValue label={t('in-forge:plugins.kongApigateway.workerStateUpdateFrequency')}>
            {data.get('workerStateUpdateFrequency')}
          </KpiKeyValue>
        )}
      </KpiSection>

      {data.get('nginxCheck') && (
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
      )}

      {data.get('statusCheck') && (
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
      )}
      {data.get('httpRequestsCheck') && <TotalHttpRequest snapshotId={snapshotId} timeConfig={timeConfig} />}

      {/* graph for shared dictionary utilization */}
      {data.get('sharedDictCheck') && (
        <div>
          <DashboardSection title={t('in-forge:plugins.kongApigateway.sharedDictTotal')}>
            <Chart
              snapshotId={snapshot.get('id')}
              timeConfig={timeConfig}
              y1={{
                formatter: percentage.compact,
                metrics: ['sharedDictTotalPercentage'],
                labels: [t('in-forge:plugins.kongApigateway.totalMemoryPercent')],
                type: 'line'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </DashboardSection>
          <SharedDictionary snapshotId={snapshotId} timeConfig={timeConfig} />
        </div>
      )}
      {data.get('nginxRequestsCheck') && <TotalRequest snapshotId={snapshotId} timeConfig={timeConfig} />}
      {data.get('nginxConnectionCheck') && <TotalConnections snapshotId={snapshotId} timeConfig={timeConfig} />}
      {data.get('allocatedBytesCheck') && <WorkerLuaVM snapshotId={snapshotId} timeConfig={timeConfig} />}

      {/* Bandwidth across all services */}
      {data.get('bandwidthCheck') && (
        <div>
          <DashboardSection title={t('in-forge:plugins.kongApigateway.totalBandwidth')}>
            <Chart
              snapshotId={snapshot.get('id')}
              timeConfig={timeConfig}
              y1={{
                formatter: bytesTwoDecimalPlaces,
                metrics: ['bandwidthBytesTotal.ingress', 'bandwidthBytesTotal.egress'],
                labels: [t('in-forge:plugins.kongApigateway.ingress'), t('in-forge:plugins.kongApigateway.egress')],
                type: 'line'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </DashboardSection>
          <BandWidth snapshotId={snapshotId} timeConfig={timeConfig} />
        </div>
      )}

      {/* Kong Latency across all services and routes */}

      {data.get('kongLatencyCheck') && (
        <div>
          <Columize>
            <DashboardSection title={t('in-forge:plugins.kongApigateway.kongLatencyAcrossallServices')}>
              <Chart
                snapshotId={snapshot.get('id')}
                timeConfig={timeConfig}
                y1={{
                  formatter: timeByMillisZeroDecimalPlaces,
                  metrics: [
                    'kongLatencyTotal.serviceLatencyFiftyPercentile',
                    'kongLatencyTotal.serviceLatencyNinetyPercentile',
                    'kongLatencyTotal.serviceLatencyNinetyfivePercentile',
                    'kongLatencyTotal.serviceLatencyNinetyninePercentile'
                  ],
                  labels: [
                    t('in-forge:plugins.kongApigateway.kongLatencyFiftyPercentile'),
                    t('in-forge:plugins.kongApigateway.kongLatencyNinetyPercentile'),
                    t('in-forge:plugins.kongApigateway.kongLatencyNinetyfivePercentile'),
                    t('in-forge:plugins.kongApigateway.kongLatencyNinetyninePercentile')
                  ],
                  type: 'line'
                }}
                renderPostChartContent={PluginDashboardsMarkerLanes}
              />
            </DashboardSection>
            <DashboardSection title={t('in-forge:plugins.kongApigateway.kongLatencyAcrossallRoutes')}>
              <Chart
                snapshotId={snapshot.get('id')}
                timeConfig={timeConfig}
                y1={{
                  formatter: timeByMillisZeroDecimalPlaces,
                  metrics: [
                    'kongLatencyTotal.routeLatencyFiftyPercentile',
                    'kongLatencyTotal.routeLatencyNinetyPercentile',
                    'kongLatencyTotal.routeLatencyNinetyfivePercentile',
                    'kongLatencyTotal.routeLatencyNinetyninePercentile'
                  ],
                  labels: [
                    t('in-forge:plugins.kongApigateway.kongLatencyFiftyPercentile'),
                    t('in-forge:plugins.kongApigateway.kongLatencyNinetyPercentile'),
                    t('in-forge:plugins.kongApigateway.kongLatencyNinetyfivePercentile'),
                    t('in-forge:plugins.kongApigateway.kongLatencyNinetyninePercentile')
                  ],
                  type: 'line'
                }}
                renderPostChartContent={PluginDashboardsMarkerLanes}
              />
            </DashboardSection>
          </Columize>
        </div>
      )}

      {/* Request Latency across all services and routes */}
      {data.get('requestLatencyCheck') && (
        <div>
          <Columize>
            <DashboardSection title={t('in-forge:plugins.kongApigateway.requestLatencyAcrossallServices')}>
              <Chart
                snapshotId={snapshot.get('id')}
                timeConfig={timeConfig}
                y1={{
                  formatter: timeByMillisZeroDecimalPlaces,
                  metrics: [
                    'requestLatencyTotal.serviceLatencyFiftyPercentile',
                    'requestLatencyTotal.serviceLatencyNinetyPercentile',
                    'requestLatencyTotal.serviceLatencyNinetyfivePercentile',
                    'requestLatencyTotal.serviceLatencyNinetyninePercentile'
                  ],
                  labels: [
                    t('in-forge:plugins.kongApigateway.kongLatencyFiftyPercentile'),
                    t('in-forge:plugins.kongApigateway.kongLatencyNinetyPercentile'),
                    t('in-forge:plugins.kongApigateway.kongLatencyNinetyfivePercentile'),
                    t('in-forge:plugins.kongApigateway.kongLatencyNinetyninePercentile')
                  ],
                  type: 'line'
                }}
                renderPostChartContent={PluginDashboardsMarkerLanes}
              />
            </DashboardSection>
            <DashboardSection title={t('in-forge:plugins.kongApigateway.requestLatencyAcrossallRoutes')}>
              <Chart
                snapshotId={snapshot.get('id')}
                timeConfig={timeConfig}
                y1={{
                  formatter: timeByMillisZeroDecimalPlaces,
                  metrics: [
                    'requestLatencyTotal.routeLatencyFiftyPercentile',
                    'requestLatencyTotal.routeLatencyNinetyPercentile',
                    'requestLatencyTotal.routeLatencyNinetyfivePercentile',
                    'requestLatencyTotal.routeLatencyNinetyninePercentile'
                  ],
                  labels: [
                    t('in-forge:plugins.kongApigateway.kongLatencyFiftyPercentile'),
                    t('in-forge:plugins.kongApigateway.kongLatencyNinetyPercentile'),
                    t('in-forge:plugins.kongApigateway.kongLatencyNinetyfivePercentile'),
                    t('in-forge:plugins.kongApigateway.kongLatencyNinetyninePercentile')
                  ],
                  type: 'line'
                }}
                renderPostChartContent={PluginDashboardsMarkerLanes}
              />
            </DashboardSection>
          </Columize>
        </div>
      )}

      {/* Upstream Latency across all services and routes */}
      {data.get('upstreamLatencyCheck') && (
        <div>
          <Columize>
            <DashboardSection title={t('in-forge:plugins.kongApigateway.upstreamLatencyAcrossallServices')}>
              <Chart
                snapshotId={snapshot.get('id')}
                timeConfig={timeConfig}
                y1={{
                  formatter: timeByMillisZeroDecimalPlaces,
                  metrics: [
                    'upstreamLatencyTotal.serviceLatencyFiftyPercentile',
                    'upstreamLatencyTotal.serviceLatencyNinetyPercentile',
                    'upstreamLatencyTotal.serviceLatencyNinetyfivePercentile',
                    'upstreamLatencyTotal.serviceLatencyNinetyninePercentile'
                  ],
                  labels: [
                    t('in-forge:plugins.kongApigateway.kongLatencyFiftyPercentile'),
                    t('in-forge:plugins.kongApigateway.kongLatencyNinetyPercentile'),
                    t('in-forge:plugins.kongApigateway.kongLatencyNinetyfivePercentile'),
                    t('in-forge:plugins.kongApigateway.kongLatencyNinetyninePercentile')
                  ],
                  type: 'line'
                }}
                renderPostChartContent={PluginDashboardsMarkerLanes}
              />
            </DashboardSection>
            <DashboardSection title={t('in-forge:plugins.kongApigateway.upstreamLatencyAcrossallRoutes')}>
              <Chart
                snapshotId={snapshot.get('id')}
                timeConfig={timeConfig}
                y1={{
                  formatter: timeByMillisZeroDecimalPlaces,
                  metrics: [
                    'upstreamLatencyTotal.routeLatencyFiftyPercentile',
                    'upstreamLatencyTotal.routeLatencyNinetyPercentile',
                    'upstreamLatencyTotal.routeLatencyNinetyfivePercentile',
                    'upstreamLatencyTotal.routeLatencyNinetyninePercentile'
                  ],
                  labels: [
                    t('in-forge:plugins.kongApigateway.kongLatencyFiftyPercentile'),
                    t('in-forge:plugins.kongApigateway.kongLatencyNinetyPercentile'),
                    t('in-forge:plugins.kongApigateway.kongLatencyNinetyfivePercentile'),
                    t('in-forge:plugins.kongApigateway.kongLatencyNinetyninePercentile')
                  ],
                  type: 'line'
                }}
                renderPostChartContent={PluginDashboardsMarkerLanes}
              />
            </DashboardSection>
          </Columize>
        </div>
      )}

      {data.get('kongLatencyCheck') && (
        <div>
          <KongKongLatency snapshotId={snapshotId} timeConfig={timeConfig} />
          <KongKongLatencyRoute snapshotId={snapshotId} timeConfig={timeConfig} />
        </div>
      )}
      {data.get('requestLatencyCheck') && (
        <div>
          <KongRequestLatency snapshotId={snapshotId} timeConfig={timeConfig} />{' '}
          <KongRequestLatencyRoute snapshotId={snapshotId} timeConfig={timeConfig} />
        </div>
      )}
      {data.get('upstreamLatencyCheck') && (
        <div>
          <KongUpstreamLatency snapshotId={snapshotId} timeConfig={timeConfig} />{' '}
          <KongUpstreamLatencyRoute snapshotId={snapshotId} timeConfig={timeConfig} />
        </div>
      )}
    </div>
  );
};

export default KongApiGatewayDashboard;
