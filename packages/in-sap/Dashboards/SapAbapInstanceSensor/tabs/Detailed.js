/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { Fragment } from 'react';

import WorkProcessListMetric from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/WorkProcessListMetric';
import DBConnectionProvider from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/DBConnectionProvider';
import FileSystemMetrics from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/FileSystemMetrics';
import BufferStatistics from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/BufferStatistics';
import DatabaseHitList from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/DatabaseHitList';
import TopProcessList from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/TopProcessList';
import LockEntryList from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/LockEntryList';
import JobDetails from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/JobDetailsMetric';
import RequestQueue from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/RequestQueue';
import TotalMemory from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/TotalMemory';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DumpStats from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/DumpStats';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { number, millis } from 'in-services/formatters/number';
import Columize from 'in-sdk/components/dashboard/Columize';
import { t } from 'in-i18n';

export default function Detailed({ timeConfig, data: sap }) {
  const snapshotId = sap.id;
  return (
    <Fragment>
      <WorkProcessListMetric snapshotId={snapshotId} timeConfig={timeConfig} />
      <TopProcessList snapshotId={snapshotId} timeConfig={timeConfig} />
      <BufferStatistics snapshotId={snapshotId} timeConfig={timeConfig} />
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
      <JobDetails snapshotId={snapshotId} timeConfig={timeConfig} />
      <TotalMemory snapshotId={snapshotId} timeConfig={timeConfig} />
      <DBConnectionProvider snapshotId={snapshotId} timeConfig={timeConfig} />
      <DatabaseHitList snapshotId={snapshotId} timeConfig={timeConfig} />
      <FileSystemMetrics snapshotId={snapshotId} timeConfig={timeConfig} />
      <DumpStats snapshotId={snapshotId} timeConfig={timeConfig} />
      <LockEntryList snapshotId={snapshotId} />
    </Fragment>
  );
}
