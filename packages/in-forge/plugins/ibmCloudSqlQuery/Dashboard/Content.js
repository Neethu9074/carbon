/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { KpiKeyValue, KpiSection } from 'in-sdk/components/dashboard/KpiSection';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { bytes, number } from 'in-services/formatters/number';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

export default function IbmCloudSqlQueryDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.ibmCloudSqlQuery.jobsInProgress')}>
          <MetricValue snapshotId={snapshotId} metric="jobs_in_progress" formatter={number.compact} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.ibmCloudSqlQuery.jobsCompleted')}>
          <MetricValue snapshotId={snapshotId} metric="completed_jobs" formatter={number.compact} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.ibmCloudSqlQuery.jobsFailed')}>
          <MetricValue snapshotId={snapshotId} metric="failed_jobs" formatter={number.compact} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.ibmCloudSqlQuery.inputRead')}>
          <MetricValue snapshotId={snapshotId} metric="bytes_read" formatter={bytes.detailed} />
        </KpiKeyValue>
      </KpiSection>
      <DashboardSection title={t('in-forge:plugins.ibmCloudSqlQuery.titleJobs')}>
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: number.compact,
            metrics: ['jobs_in_progress', 'completed_jobs', 'failed_jobs'],
            labels: [
              t('in-forge:plugins.ibmCloudSqlQuery.inProgress'),
              t('in-forge:plugins.ibmCloudSqlQuery.completed'),
              t('in-forge:plugins.ibmCloudSqlQuery.failed')
            ],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.ibmCloudSqlQuery.titleInput')}>
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: bytes.detailed,
            metrics: ['bytes_read'],
            labels: [t('in-forge:plugins.ibmCloudSqlQuery.read')],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
    </div>
  );
}
