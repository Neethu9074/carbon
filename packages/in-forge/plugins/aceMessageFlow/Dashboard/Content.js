/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import FlowNodeTable from 'in-forge/plugins/aceMessageFlow/Dashboard/FlowNodeTable';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { micros, number, bytes } from 'in-services/formatters/number';

export default function AceMessageFlowDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <DashboardSection title={t('in-forge:plugins.aceMessageFlow.elapsedTime')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: micros.compact,
            tooltipFormatter: micros.compact,
            metrics: [`totalElapsedTime`, `maxElapsedTime`, `minElapsedTime`],
            labels: [
              t('in-forge:plugins.aceMessageFlow.totalElapsedTime'),
              t('in-forge:plugins.aceMessageFlow.maxElapsedTime'),
              t('in-forge:plugins.aceMessageFlow.minElapsedTime')
            ],
            type: 'line'
          }}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.aceMessageFlow.elapsedTimeWaitingForInputMsgs')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: micros.compact,
            tooltipFormatter: micros.compact,
            metrics: [`elapsedTimeWaitingForInputMsgs`],
            labels: [t('in-forge:plugins.aceMessageFlow.elapsedTimeWaitingForInputMsgs')],
            type: 'line'
          }}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.aceMessageFlow.sizeOfInputMsgs')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: bytes.compact,
            tooltipFormatter: bytes.compact,
            metrics: [`totalSizeOfInputMsgs`, `maxSizeOfInputMsgs`, `minSizeOfInputMsgs`],
            labels: [
              t('in-forge:plugins.aceMessageFlow.totalSizeOfInputMsgs'),
              t('in-forge:plugins.aceMessageFlow.maxSizeOfInputMsgs'),
              t('in-forge:plugins.aceMessageFlow.minSizeOfInputMsgs')
            ],
            type: 'line'
          }}
          y2={{
            formatter: number.compact,
            tooltipFormatter: number.compact,
            metrics: [`totalInputMessages`],
            labels: [t('in-forge:plugins.aceMessageFlow.totalInputMessages')],
            type: 'line'
          }}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.aceMessageFlow.cpuTime')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: micros.compact,
            tooltipFormatter: micros.compact,
            metrics: [`totalCpuTime`, `maxCpuTime`, `minCpuTime`],
            labels: [
              t('in-forge:plugins.aceMessageFlow.totalCpuTime'),
              t('in-forge:plugins.aceMessageFlow.maxCpuTime'),
              t('in-forge:plugins.aceMessageFlow.minCpuTime')
            ],
            type: 'line'
          }}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.aceMessageFlow.cpuTimeWaitingForInputMsgs')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: micros.compact,
            tooltipFormatter: micros.compact,
            metrics: [`cpuTimeWaitingForInputMsgs`],
            labels: [t('in-forge:plugins.aceMessageFlow.cpuTimeWaitingForInputMsgs')],
            type: 'line'
          }}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.aceMessageFlow.threads')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: number.compact,
            tooltipFormatter: number.compact,
            metrics: [`threadsInPool`, `timesMaxNumberOfThreadsReached`],
            labels: [
              t('in-forge:plugins.aceMessageFlow.threadsInPool'),
              t('in-forge:plugins.aceMessageFlow.timesMaxNumberOfThreadsReached')
            ],
            type: 'line'
          }}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.aceMessageFlow.timeOutAndErrors')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: number.compact,
            tooltipFormatter: number.compact,
            metrics: [`mqErrors`, `msgWithErrors`, `processingMsgErrors`, `timeOutsWaitingForRepliesToAggregateMsgs`],
            labels: [
              t('in-forge:plugins.aceMessageFlow.mqErrors'),
              t('in-forge:plugins.aceMessageFlow.msgWithErrors'),
              t('in-forge:plugins.aceMessageFlow.processingMsgErrors'),
              t('in-forge:plugins.aceMessageFlow.timeOutsWaitingForRepliesToAggregateMsgs')
            ],
            type: 'line'
          }}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.aceMessageFlow.commitsAndBackouts')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: number.compact,
            tooltipFormatter: number.compact,
            metrics: [`commits`, `backouts`],
            labels: [t('in-forge:plugins.aceMessageFlow.commits'), t('in-forge:plugins.aceMessageFlow.backouts')],
            type: 'line'
          }}
        />
      </DashboardSection>
      <FlowNodeTable snapshotId={snapshotId} timeConfig={timeConfig} />
    </div>
  );
}
