/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { KpiKeyValue, KpiSection } from 'in-sdk/components/dashboard/KpiSection';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { number, bytes, seconds } from 'in-services/formatters/number';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

export default function ibmCloudClinicalDataDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.ibmCloudClinicalData.labelCallsCount')}>
          <MetricValue snapshotId={snapshotId} metric="calls_count" formatter={number.compact} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.ibmCloudClinicalData.labelRequestSizeBytes')}>
          <MetricValue snapshotId={snapshotId} metric="request_size_bytes" formatter={bytes.compact} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.ibmCloudClinicalData.labelTimeSeconds')}>
          <MetricValue snapshotId={snapshotId} metric="time_seconds" formatter={seconds.fixedCompact} />
        </KpiKeyValue>
      </KpiSection>
      <DashboardSection title={t('in-forge:plugins.ibmCloudClinicalData.labelApiCalls')}>
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: number.compact,
            metrics: ['calls_count'],
            labels: [t('in-forge:plugins.ibmCloudClinicalData.labelCallsCount')],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: bytes.detailed,
            metrics: ['request_size_bytes'],
            labels: [t('in-forge:plugins.ibmCloudClinicalData.labelRequestSizeBytes')],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: seconds.fixedCompact,
            metrics: ['time_seconds'],
            labels: [t('in-forge:plugins.ibmCloudClinicalData.labelTimeSeconds')],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
    </div>
  );
}
