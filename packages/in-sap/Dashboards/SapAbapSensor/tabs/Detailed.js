/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { Fragment } from 'react';

import WorkProcessListMetric from 'in-sap/Dashboards/SapAbapSensor/tabs/WorkProcessListMetric.js';
import DBConnectionProvider from 'in-sap/Dashboards/SapAbapSensor/tabs/DBConnectionProvider.js';
import DatabaseHitList from 'in-sap/Dashboards/SapAbapSensor/tabs/DatabaseHitList.js';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import TotalMemory from 'in-sap/Dashboards/SapAbapSensor/tabs/TotalMemory.js';
import RequestQueue from 'in-sap/Dashboards/SapAbapSensor/tabs/RequestQueue';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import DumpStats from 'in-sap/Dashboards/SapAbapSensor/tabs/DumpStats';
import { number, millis } from 'in-services/formatters/number';
import Columize from 'in-sdk/components/dashboard/Columize';
import { t } from 'in-i18n';

export default function Detailed({ timeConfig, data: sap }) {
  const snapshotId = sap.id;
  return (
    <Fragment>
      <WorkProcessListMetric snapshotId={snapshotId} timeConfig={timeConfig} />
      <RequestQueue snapshotId={snapshotId} timeConfig={timeConfig} />
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
      <TotalMemory snapshotId={snapshotId} timeConfig={timeConfig} />
      <Columize>
        <DashboardSection title={t('in-sap:dashboards.swapMemory')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['swapmemory.swapConf', 'swapmemory.freeSwap', 'swapmemory.swapSize', 'swapmemory.swapMax'],
              labels: [
                t('in-sap:dashboards.swapConf'),
                t('in-sap:dashboards.freeSwap'),
                t('in-sap:dashboards.swapSize'),
                t('in-sap:dashboards.swapMax')
              ],
              type: 'line',
              formatter: number
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <DBConnectionProvider snapshotId={snapshotId} />
      <DatabaseHitList snapshotId={snapshotId} timeConfig={timeConfig} />
      <DumpStats snapshotId={snapshotId} />
    </Fragment>
  );
}
