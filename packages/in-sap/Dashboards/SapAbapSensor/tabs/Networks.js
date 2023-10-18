/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { Fragment } from 'react';

import GatewayConnections from 'in-sap/Dashboards/SapAbapSensor/tabs/GatewayConnections.js';
import ICMServicesList from 'in-sap/Dashboards/SapAbapSensor/tabs/ICMServicesList.js';
import ICMServiceList from 'in-sap/Dashboards/SapAbapSensor/tabs/ICMServiceList.js';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import ICMThreadList from 'in-sap/Dashboards/SapAbapSensor/tabs/ICMThreadList.js';
import LanInterface from 'in-sap/Dashboards/SapAbapSensor/tabs/LanInterface.js';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Columize from 'in-sdk/components/dashboard/Columize';
import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default function Networks({ timeConfig, data: sap }) {
  const snapshotId = sap.id;
  return (
    <Fragment>
      <GatewayConnections snapshotId={snapshotId} />
      <LanInterface snapshotId={snapshotId} timeConfig={timeConfig} />
      <Columize>
        <DashboardSection title={t('in-sap:dashboards.icmInfo')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['icminfodatastats.status', 'icminfodatastats.traceLvl'],
              labels: [t('in-sap:dashboards.status'), t('in-sap:dashboards.traceLvl')],
              type: 'line',
              formatter: number
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-sap:dashboards.icmThreads')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['icminfodatastats.maxThr', 'icminfodatastats.peekThr'],
              labels: [t('in-sap:dashboards.maxThr'), t('in-sap:dashboards.peekThr')],
              type: 'line',
              formatter: number
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <Columize>
        <DashboardSection title={t('in-sap:dashboards.icmConnections')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['icminfodatastats.maxConn', 'icminfodatastats.peekConn', 'icminfodatastats.curConn'],
              labels: [t('in-sap:dashboards.maxConn'), t('in-sap:dashboards.peekConn'), t('in-sap:dashboards.curConn')],
              type: 'line',
              formatter: number
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-sap:dashboards.icmQueue')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['icminfodatastats.maxQueue', 'icminfodatastats.peekQueue', 'icminfodatastats.curQueue'],
              labels: [
                t('in-sap:dashboards.maxQueue'),
                t('in-sap:dashboards.peekQueue'),
                t('in-sap:dashboards.curQueue')
              ],
              type: 'line',
              formatter: number
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <ICMThreadList snapshotId={snapshotId} />
      <ICMServiceList snapshotId={snapshotId} />
      <ICMServicesList snapshotId={snapshotId} />
    </Fragment>
  );
}
