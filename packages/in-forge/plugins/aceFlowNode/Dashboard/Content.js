/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { micros, number } from 'in-services/formatters/number';

export default function AceFlowNodeDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <DashboardSection title={t('in-forge:plugins.aceFlowNode.cpuTime')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: micros.compact,
            tooltipFormatter: micros.compact,
            metrics: [`totalCpuTime`, `maxCpuTime`, `minCpuTime`],
            labels: [
              t('in-forge:plugins.aceFlowNode.totalCpuTime'),
              t('in-forge:plugins.aceFlowNode.maxCpuTime'),
              t('in-forge:plugins.aceFlowNode.minCpuTime')
            ],
            type: 'line'
          }}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.aceFlowNode.elapsedTime')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: micros.compact,
            tooltipFormatter: micros.compact,
            metrics: [`totalElapsedTime`, `maxElapsedTime`, `minElapsedTime`],
            labels: [
              t('in-forge:plugins.aceFlowNode.totalElapsedTime'),
              t('in-forge:plugins.aceFlowNode.maxElapsedTime'),
              t('in-forge:plugins.aceFlowNode.minElapsedTime')
            ],
            type: 'line'
          }}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.aceFlowNode.invocations')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: number.compact,
            tooltipFormatter: number.compact,
            metrics: [`invocations`],
            labels: [t('in-forge:plugins.aceFlowNode.invocations')],
            type: 'line'
          }}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.aceFlowNode.terminals')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: number.compact,
            tooltipFormatter: number.compact,
            metrics: [`inputTerminals`, `outputTerminals`],
            labels: [
              t('in-forge:plugins.aceFlowNode.inputTerminals'),
              t('in-forge:plugins.aceFlowNode.outputTerminals')
            ],
            type: 'line'
          }}
        />
      </DashboardSection>
    </div>
  );
}
