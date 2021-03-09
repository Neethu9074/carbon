/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import MessageFlowTable from 'in-forge/plugins/aceIntegrationServer/Dashboard/MessageFlowTable';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { number, bytes } from 'in-services/formatters/number';
import MetricValue from 'in-components/MetricValue';

export default function AceIntegrationServerDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.aceIntegrationServer.cumulativeNumberOfGcCollections')}>
          <MetricValue
            snapshotId={snapshot.get('id')}
            metric="cumulativeNumberOfGcCollections"
            formatter={number.compact}
          />
        </KpiKeyValue>

        <KpiKeyValue label={t('in-forge:plugins.aceIntegrationServer.cumulativeGCTimeInSeconds')}>
          <MetricValue snapshotId={snapshot.get('id')} metric="cumulativeGCTimeInSeconds" formatter={number.compact} />
        </KpiKeyValue>
      </KpiSection>
      <DashboardSection title={t('in-forge:plugins.aceIntegrationServer.jvmHeapMemory')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: bytes.compact,
            tooltipFormatter: bytes.compact,
            metrics: [`heapMemInitial`, `heapMemMax`, `heapMemCommitted`, `heapMemUsed`],
            labels: [
              t('in-forge:plugins.aceIntegrationServer.heapMemInitial'),
              t('in-forge:plugins.aceIntegrationServer.heapMemMax'),
              t('in-forge:plugins.aceIntegrationServer.heapMemCommitted'),
              t('in-forge:plugins.aceIntegrationServer.heapMemUsed')
            ],
            type: 'line'
          }}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.aceIntegrationServer.jvmNonHeapMemory')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: bytes.compact,
            tooltipFormatter: bytes.compact,
            metrics: [`nonHeapMemInitial`, `nonHeapMemMax`, `nonHeapMemCommitted`, `nonHeapMemUsed`],
            labels: [
              t('in-forge:plugins.aceIntegrationServer.nonHeapMemInitial'),
              t('in-forge:plugins.aceIntegrationServer.nonHeapMemMax'),
              t('in-forge:plugins.aceIntegrationServer.nonHeapMemCommitted'),
              t('in-forge:plugins.aceIntegrationServer.nonHeapMemUsed')
            ],
            type: 'line'
          }}
        />
      </DashboardSection>
      <MessageFlowTable snapshotId={snapshotId} timeConfig={timeConfig} />
    </div>
  );
}
