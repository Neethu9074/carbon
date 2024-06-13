/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Card } from '@instana/components';

import WorkProcessListMetric from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/WorkProcessListMetric';
import DBConnectionProvider from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/DBConnectionProvider';
import FileSystemMetrics from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/FileSystemMetrics';
import DiskSummaryStats from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/DiskSummaryStats';
import BufferStatistics from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/BufferStatistics';
import DatabaseHitList from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/DatabaseHitList';
import TopProcessList from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/TopProcessList';
import SystemLogStats from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/SystemLogStats';
import LockEntryList from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/LockEntryList';
import JobDetails from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/JobDetailsMetric';
import RequestQueue from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/RequestQueue';
import TotalMemory from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/TotalMemory';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import DumpStats from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/DumpStats';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Columize from 'in-sdk/components/dashboard/Columize';
import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

import locals from 'in-sdk/components/dashboard/DashboardSection/DashboardSection.mless';

export default function Detailed({ timeConfig, data: sap }) {
  const snapshotId = sap.id;
  return (
    <>
      <WorkProcessListMetric snapshotId={snapshotId} timeConfig={timeConfig} />
      <TopProcessList snapshotId={snapshotId} timeConfig={timeConfig} props={sap} />
      <div className={locals.dashboardSection}>
        <Card>
          <Columize>
            <DashboardSection title={t('in-sap:dashboards.dispatcherRequestQueues')}>
              <Chart
                snapshotId={snapshotId}
                timeConfig={timeConfig}
                y1={{
                  min: 0,
                  metrics: [
                    'queueStats.dialogWait',
                    'queueStats.updateWait',
                    'queueStats.enqueueWait',
                    'queueStats.btcWait',
                    'queueStats.spoolWait',
                    'queueStats.update2Wait',
                    'queueStats.nowpWait'
                  ],
                  labels: [
                    t('in-sap:dashboards.dialogWait'),
                    t('in-sap:dashboards.updateWait'),
                    t('in-sap:dashboards.enqueue'),
                    t('in-sap:dashboards.background'),
                    t('in-sap:dashboards.spoolWait'),
                    t('in-sap:dashboards.update2Wait'),
                    t('in-sap:dashboards.nowpWait')
                  ],
                  type: 'line',
                  formatter: number.compact
                }}
              />
            </DashboardSection>
          </Columize>
          <RequestQueue snapshotId={snapshotId} timeConfig={timeConfig} />
        </Card>
      </div>
      <JobDetails snapshotId={snapshotId} timeConfig={timeConfig} />
      <TotalMemory snapshotId={snapshotId} timeConfig={timeConfig} />
      <BufferStatistics snapshotId={snapshotId} timeConfig={timeConfig} />
      <DiskSummaryStats snapshotId={snapshotId} timeConfig={timeConfig} />
      <DBConnectionProvider snapshotId={snapshotId} timeConfig={timeConfig} />
      <DatabaseHitList snapshotId={snapshotId} timeConfig={timeConfig} />
      <FileSystemMetrics snapshotId={snapshotId} timeConfig={timeConfig} />
      <DumpStats snapshotId={snapshotId} timeConfig={timeConfig} />
      <SystemLogStats snapshotId={snapshotId} timeConfig={timeConfig} />
      <LockEntryList snapshotId={snapshotId} />
    </>
  );
}
