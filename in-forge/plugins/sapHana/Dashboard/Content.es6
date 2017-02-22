import React from 'react';

import {
  zeroDecimalPlaces,
  bytesTwoDecimalPlaces,
  percentageZeroDecimalPlaces
} from 'in-services/formatters/number';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import DashboardNotification from 'in-components/DashboardNotification';
import ChartWithLegend from 'in-components/ChartWithLegend';

import AlertsTable from './AlertsTable.es6';

export default function Dashboard({snapshot, timeframe}) {
  const sensorConnectionStatus = snapshot.getIn(['data', 'sensorConnectionStatus'], 'OK');
  if (sensorConnectionStatus !== 'OK') {
    return (
      <DashboardNotification type='info'>
        {sensorConnectionStatus}
      </DashboardNotification>);
  }

  return (
    <div>
      <AlertsTable snapshot={snapshot}
                   timeframe={timeframe} />

      <DashboardSection title='SAP HANA Memory Usage'>
        <ChartWithLegend snapshotId={snapshot.get('id')}
                         timeframe={timeframe}
                         margins={{
                           left: 80
                         }}
                         y1={{
                           formatter: bytesTwoDecimalPlaces,
                           metrics: [
                             'stats.usedMemory',
                             'stats.residentMemory'
                           ],
                           labels: [
                             'Used Memory',
                             'Resident Memory'
                           ],
                           type: 'line'
                         }} />
      </DashboardSection>
      <DashboardSection title='SAP HANA Cpu Usage'>
        <ChartWithLegend snapshotId={snapshot.get('id')}
                         timeframe={timeframe}
                         margins={{
                           left: 80
                         }}
                         y1={{
                           formatter: percentageZeroDecimalPlaces,
                           metrics: [
                             'stats.cpuUsage'
                           ],
                           labels: [
                             'Cpu Usage'
                           ],
                           type: 'area'
                         }} />
      </DashboardSection>
      <DashboardSection title='Disk Usage'>
        <ChartWithLegend snapshotId={snapshot.get('id')}
                         timeframe={timeframe}
                         height={200}
                         margins={{
                           left: 80
                         }}
                         y1={{
                           formatter: bytesTwoDecimalPlaces,
                           metrics: [
                             'stats.diskUsageData',
                             'stats.diskUsageLog',
                             'stats.diskUsageTrace'
                           ],
                           labels: [
                             'Data Size',
                             'Log Size',
                             'Trace Size'
                           ],
                           type: 'line'
                         }} />
      </DashboardSection>
      <DashboardSection title='Connections'>
        <ChartWithLegend snapshotId={snapshot.get('id')}
                         timeframe={timeframe}
                         height={200}
                         margins={{
                           left: 80
                         }}
                         y1={{
                           formatter: zeroDecimalPlaces,
                           metrics: [
                             'stats.idleConnectionCount',
                             'stats.runningConnectionCount'
                           ],
                           labels: [
                             'Idle',
                             'Running'
                           ],
                           type: 'stackedArea'
                         }} />
      </DashboardSection>
      <DashboardSection title='Threads'>
        <ChartWithLegend snapshotId={snapshot.get('id')}
                         timeframe={timeframe}
                         height={200}
                         margins={{
                           left: 80
                         }}
                         y1={{
                           formatter: zeroDecimalPlaces,
                           metrics: [
                             'stats.totalCount',
                             'stats.activeCount',
                             'stats.blockedCount'
                           ],
                           labels: [
                             'Total',
                             'Active',
                             'Blocked'
                           ],
                           type: 'line'
                         }} />
      </DashboardSection>
      <DashboardSection title='Job Worker Threads'>
        <ChartWithLegend snapshotId={snapshot.get('id')}
                         timeframe={timeframe}
                         height={200}
                         margins={{
                           left: 80
                         }}
                         y1={{
                           formatter: zeroDecimalPlaces,
                           metrics: [
                             'stats.jobWorkerCount',
                             'stats.jobWorkerActiveCount',
                             'stats.jobWorkerBlockedCount'
                           ],
                           labels: [
                             'Total',
                             'Active',
                             'Blocked'
                           ],
                           type: 'line'
                         }} />
      </DashboardSection>
      <DashboardSection title='Sql Executor Threads'>
        <ChartWithLegend snapshotId={snapshot.get('id')}
                         timeframe={timeframe}
                         height={200}
                         margins={{
                           left: 80
                         }}
                         y1={{
                           formatter: zeroDecimalPlaces,
                           metrics: [
                             'stats.sqlExecutorCount',
                             'stats.sqlExecutorActiveCount',
                             'stats.sqlExecutorBlockedCount'
                           ],
                           labels: [
                             'Total',
                             'Active',
                             'Blocked'
                           ],
                           type: 'line'
                         }} />
      </DashboardSection>
    </div>
  );
}
