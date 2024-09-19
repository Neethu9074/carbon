/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { Fragment } from 'react';

import { Card } from '@instana/components';

// @ts-expect-error Module needs to be translated to TS
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import OutboundTransactionalRfcInfo from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/OutboundTransactionalRfcInfo';
import OutboundQueueRfcInfo from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/OutboundQueueRfcInfo';
import InboundQueueRfcInfo from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/InboundQueueRfcInfo';
import HttpMetricsStats from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/HttpMetricsStats';
import TransportRequest from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/TransportRequest';
import SpoolMetricStat from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/SpoolMetricStat';
import RfcErrorLogs from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/RfcErrorLogs';
import RFCCallsMetrics from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/RFCCalls';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import SpoolError from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/SpoolError';
import UserInfo from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs//UserInfo';
import UserList from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/UserList';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { productAreas } from 'in-services/tracking/productAreas';
import { number, millis } from 'in-services/formatters/number';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import Columize from 'in-sdk/components/dashboard/Columize';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { pageNames } from 'in-services/tracking/pageNames';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { t } from 'in-i18n';

import locals from 'in-sdk/components/dashboard/DashboardSection/DashboardSection.mless';

export default function SecurityEssentials({ data }: { data: SnapshotData }) {
  const timeConfig = useTimeConfig();
  const snapshotId = data.id;
  return (
    <Fragment>
      <ViewTrackingMeta
        data={{
          productArea: productAreas.sap,
          pageRootName: pageNames.abap_instance_transactional_statistics
        }}
      />
      <UserInfo snapshotId={snapshotId} timeConfig={timeConfig} />
      <Columize>
        <DashboardSection title={t('in-sap:dashboards.loginTypes')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['versionstats.totalRfc', 'versionstats.totalGui', 'versionstats.totalDemon'],
              labels: [t('in-sap:dashboards.rfc'), t('in-sap:dashboards.gui'), t('in-sap:dashboards.daemon')],
              type: 'stackedBar',
              formatter: number.compact
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-sap:dashboards.rfcLogins')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['versionstats.totalInternalRfc', 'versionstats.totalExternalRfc'],
              labels: [t('in-sap:dashboards.internal'), t('in-sap:dashboards.external')],
              type: 'stackedBar',
              formatter: number.compact
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-sap:dashboards.versionInfo')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: [
                'versionstats.version750',
                'versionstats.version760',
                'versionstats.version770',
                'versionstats.version780',
                'versionstats.version800',
                'versionstats.versionOthers'
              ],
              labels: [
                t('in-sap:dashboards.noOfVersion750'),
                t('in-sap:dashboards.noOfVersion760'),
                t('in-sap:dashboards.noOfVersion770'),
                t('in-sap:dashboards.noOfVersion780'),
                t('in-sap:dashboards.noOfVersion800'),
                t('in-sap:dashboards.noOfVersionOthers')
              ],
              type: 'line',
              formatter: number.compact
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <div className={locals.dashboardSection}>
        <Card title={t('in-sap:dashboards.spoolStats')}>
          <Columize>
            <DashboardSection>
              <Chart
                snapshotId={snapshotId}
                timeConfig={timeConfig}
                y1={{
                  min: 0,
                  metrics: ['spoolStats.count', 'spoolStats.processed', 'spoolStats.pJPages'],
                  labels: [
                    t('in-sap:dashboards.spoolCount'),
                    t('in-sap:dashboards.processed'),
                    t('in-sap:dashboards.pJPages')
                  ],
                  type: 'line',
                  formatter: number.compact
                }}
                renderPostChartContent={PluginDashboardsMarkerLanes}
              />
            </DashboardSection>

            <DashboardSection>
              <Chart
                snapshotId={snapshotId}
                timeConfig={timeConfig}
                y1={{
                  min: 0,
                  metrics: ['spoolStats.responseTime', 'spoolStats.processTime', 'spoolStats.cpuTime'],
                  labels: [
                    t('in-sap:dashboards.responseTime'),
                    t('in-sap:dashboards.processTime'),
                    t('in-sap:dashboards.cpuTime')
                  ],
                  type: 'line',
                  formatter: millis.compact
                }}
                renderPostChartContent={PluginDashboardsMarkerLanes}
              />
            </DashboardSection>
          </Columize>
        </Card>
      </div>
      <SpoolError snapshotId={snapshotId} />
      <SpoolMetricStat snapshotId={snapshotId} timeConfig={timeConfig} />
      <UserList snapshotId={snapshotId} timeConfig={timeConfig} />
      <RFCCallsMetrics snapshotId={snapshotId} timeConfig={timeConfig} />
      <RfcErrorLogs snapshotId={snapshotId} timeConfig={timeConfig} />
      <OutboundTransactionalRfcInfo snapshotId={snapshotId} timeConfig={timeConfig} />
      <InboundQueueRfcInfo snapshotId={snapshotId} timeConfig={timeConfig} />
      <OutboundQueueRfcInfo snapshotId={snapshotId} timeConfig={timeConfig} />
      <HttpMetricsStats snapshotId={snapshotId} timeConfig={timeConfig} />
      <TransportRequest snapshotId={snapshotId} />
    </Fragment>
  );
}
