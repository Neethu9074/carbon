/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { TimeConfig } from '@instana/types';

//@ts-expect-error
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import Space from 'in-forge/plugins/ibmApiConnectCatalog/Dashboard/SpaceTables';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { number, millis } from 'in-services/formatters/number';
import Columize from 'in-sdk/components/dashboard/Columize';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

interface IbmApiConnectCatalogDashboardProps {
  snapshot: SnapshotData;
  timeConfig: TimeConfig;
}

const IbmApiConnectCatalogDashboard = ({ snapshot, timeConfig }: IbmApiConnectCatalogDashboardProps) => {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.ibmApiConnect.totalApiCalls')}>
          <MetricValue snapshotId={snapshotId} metric="totalApiCalls" formatter={number.compact} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.ibmApiConnect.totalErrors')}>
          <MetricValue snapshotId={snapshotId} metric="totalError" formatter={number.compact} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.ibmApiConnect.maxApiResponse')}>
          <MetricValue snapshotId={snapshotId} metric="maxResponseTime" formatter={millis.detailed} />
        </KpiKeyValue>
      </KpiSection>

      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.ibmApiConnect.avgApiResponse')}>
          <MetricValue snapshotId={snapshotId} metric="avgResponseTime" formatter={millis.detailed} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.ibmApiConnect.minApiResponse')}>
          <MetricValue snapshotId={snapshotId} metric="minResponseTime" formatter={millis.detailed} />
        </KpiKeyValue>
      </KpiSection>

      <Columize>
        <DashboardSection title={t('in-forge:plugins.ibmApiConnectCatalog.2xxstatus')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['status2xx', 'avgStatus2xx'],
              labels: [
                t('in-forge:plugins.ibmApiConnectCatalog.count'),
                t('in-forge:plugins.ibmApiConnectCatalog.average')
              ],
              type: 'line',
              formatter: number.compact
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.ibmApiConnectCatalog.4xxstatus')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: number.compact,
              metrics: ['status4xx', 'avgStatus4xx'],
              labels: [
                t('in-forge:plugins.ibmApiConnectCatalog.count'),
                t('in-forge:plugins.ibmApiConnectCatalog.average')
              ],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.ibmApiConnectCatalog.5xxstatus')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: number.compact,
              metrics: ['status5xx', 'avgStatus5xx'],
              labels: [
                t('in-forge:plugins.ibmApiConnectCatalog.count'),
                t('in-forge:plugins.ibmApiConnectCatalog.average')
              ],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <DashboardSection title={t('in-forge:plugins.ibmApiConnectCatalog.timeToServeSuccess')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: number.compact,
            metrics: [
              'totalApiCallSuccess',
              'avgResponseTimeSuccess',
              'minResponseTimeSuccess',
              'maxResponseTimeSuccess'
            ],
            labels: [
              t('in-forge:plugins.ibmApiConnect.totalApiCalls'),
              t('in-forge:plugins.ibmApiConnectCatalog.averageResponseTime'),
              t('in-forge:plugins.ibmApiConnectCatalog.minResponseTime'),
              t('in-forge:plugins.ibmApiConnectCatalog.maxResponseTime')
            ],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.ibmApiConnectCatalog.timeToServeFailure')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: number.compact,
            metrics: ['totalApiCallError', 'avgResponseTimeError', 'minResponseTimeError', 'maxResponseTimeError'],
            labels: [
              t('in-forge:plugins.ibmApiConnect.totalApiCalls'),
              t('in-forge:plugins.ibmApiConnectCatalog.averageResponseTime'),
              t('in-forge:plugins.ibmApiConnectCatalog.minResponseTime'),
              t('in-forge:plugins.ibmApiConnectCatalog.maxResponseTime')
            ],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <Space snapshotId={snapshotId} timeConfig={timeConfig} />
    </div>
  );
};

export default IbmApiConnectCatalogDashboard;
