/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { Fragment } from 'react';

import HttpMetricsStats from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/HttpMetricsStats';
import RFCCallsMetrics from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/RFCCalls';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import UserList from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/UserList';
import UserInfo from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/UserInfo';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { number, millis } from 'in-services/formatters/number';
import Columize from 'in-sdk/components/dashboard/Columize';
import { t } from 'in-i18n';

export default function SecurityEssentials({ timeConfig, data: sap }) {
  const snapshotId = sap.id;
  return (
    <Fragment>
      <UserInfo snapshotId={snapshotId} timeConfig={timeConfig} />
      <Columize>
        <DashboardSection title={t('in-sap:dashboards.allLogins')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: [
                'versionstats.totalCalls',
                'versionstats.totalRfc',
                'versionstats.totalGui',
                'versionstats.totalDemon'
              ],
              labels: [
                t('in-sap:abapsensor.metrics.total'),
                t('in-sap:dashboards.rfc'),
                t('in-sap:dashboards.gui'),
                t('in-sap:dashboards.daemon')
              ],
              type: 'line',
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
              metrics: ['versionstats.totalRfc', 'versionstats.totalInternalRfc', 'versionstats.totalExternalRfc'],
              labels: [
                t('in-sap:abapsensor.metrics.total'),
                t('in-sap:dashboards.internalRfc'),
                t('in-sap:dashboards.externalRfc')
              ],
              type: 'line',
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
      <Columize>
        <DashboardSection title={t('in-sap:dashboards.spoolStats')}>
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
              formatter: number
            }}
            y2={{
              min: 0,
              metrics: ['spoolStats.responseTime', 'spoolStats.processTime', 'spoolStats.cpuTime'],
              labels: [
                t('in-sap:dashboards.responseTime'),
                t('in-sap:dashboards.processTime'),
                t('in-sap:dashboards.cpuTime')
              ],
              type: 'line',
              formatter: millis
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <UserList snapshotId={snapshotId} timeConfig={timeConfig} />
      <RFCCallsMetrics snapshotId={snapshotId} timeConfig={timeConfig} />
      <HttpMetricsStats snapshotId={snapshotId} timeConfig={timeConfig} />
    </Fragment>
  );
}
