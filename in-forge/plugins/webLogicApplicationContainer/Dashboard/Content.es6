import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import { zeroDecimalPlaces } from 'in-services/formatters/number';

import DatasourcesTable from './DatasourcesTable';
import WebAppsTable from './WebAppsTable';

export default function Dashboard({ snapshot, timeframe }) {
  const threadPoolStuckThreadsMetricAvailable = snapshot.getIn(['data', 'threadPool.stuckThreadsAvailable'], false);
  const threadPoolMetrics = [
    'threadPool.idleThreads',
    'threadPool.totalThreads',
    'threadPool.hoggingThreads',
    'threadPool.standbyThreads'
  ];
  const threadPoolLabels = ['Idle Threads', 'Total Threads', 'Hogging Threads', 'Stand by Threads'];
  if (threadPoolStuckThreadsMetricAvailable) {
    threadPoolMetrics.push('threadPool.stuckThreads');
    threadPoolLabels.push('Stuck Threads');
  }
  const serverLogRuntimeMBeanAvailable = snapshot.getIn(
    ['data', 'serverLogMessages.serverLogRuntimeMBeanAvailable'],
    false
  );
  return (
    <div>
      <WebAppsTable snapshot={snapshot} timeframe={timeframe} />
      <DashboardSection title="Thread Pool">
        <ChartWithLegend
          snapshotId={snapshot.get('id')}
          timeframe={timeframe}
          margins={{
            left: 80
          }}
          y1={{
            formatter: zeroDecimalPlaces,
            metrics: threadPoolMetrics,
            labels: threadPoolLabels,
            type: 'line'
          }}
        />
      </DashboardSection>
      {serverLogRuntimeMBeanAvailable
        ? <DashboardSection title="Server Log Messages by Severity">
            <ChartWithLegend
              snapshotId={snapshot.get('id')}
              timeframe={timeframe}
              margins={{
                left: 80
              }}
              y1={{
                formatter: zeroDecimalPlaces,
                metrics: [
                  'serverLogMessages.warnings',
                  'serverLogMessages.errors',
                  'serverLogMessages.alerts',
                  'serverLogMessages.criticals',
                  'serverLogMessages.emergencies'
                ],
                labels: ['Warning', 'Error', 'Alert', 'Critical', 'Emergencie'],
                type: 'line'
              }}
            />
          </DashboardSection>
        : null}
      <DatasourcesTable snapshot={snapshot} timeframe={timeframe} />
    </div>
  );
}
