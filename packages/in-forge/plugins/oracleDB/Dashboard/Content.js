import React from 'react';

import {
  number,
  millis,
  micros,
  hitRateTwoDecimalPlaces,
  percentageTwoDecimalPlaces
} from 'in-services/formatters/number';
import DBmarlinNotificationMessage from 'in-integrations/database/dbmarlin/DBmarlinNotificationMessage';
import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import TablespaceUsagesTable from './TablespaceUsagesTable.js';

export default function OracleDBDashboard({ snapshot, timeConfig }) {
  const sensorConnectionStatus = snapshot.getIn(['data', 'sensorConnectionStatus'], 'OK');
  if (sensorConnectionStatus !== 'OK') {
    return <DashboardNotification type="info">{sensorConnectionStatus}</DashboardNotification>;
  }

  return (
    <div>
      <DashboardSection title="DB Time per Second">
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            formatter: micros.detailed,
            metrics: ['stats.dbTime', 'stats.cpuTime', 'stats.sqlExecuteTime', 'stats.parseTime'],
            labels: ['DB', 'DB CPU', 'SQL Execute', 'Parse'],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="DB / CPU Time">
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            max: 1,
            formatter: hitRateTwoDecimalPlaces,
            metrics: ['stats.cpuTimeDbTimeRatio'],
            labels: ['Ratio'],
            type: 'area'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="Time Waited per Second">
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          height={200}
          y1={{
            formatter: millis.detailed,
            metrics: [
              'stats.timeWaited.userIO',
              'stats.timeWaited.other',
              'stats.timeWaited.systemIO',
              'stats.timeWaited.concurrency',
              'stats.timeWaited.scheduler',
              'stats.timeWaited.application',
              'stats.timeWaited.commit',
              'stats.timeWaited.configuration',
              'stats.timeWaited.administrative',
              'stats.timeWaited.network',
              'stats.timeWaited.queue'
            ],
            labels: [
              'User I/O',
              'Other',
              'System I/O',
              'Concurrency',
              'Scheduler',
              'Application',
              'Commit',
              'Configuration',
              'Administrative',
              'Network',
              'Queueing'
            ],
            type: 'stackedArea'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="SQL Execution">
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            formatter: number.compact,
            metrics: ['stats.sqlExecuteCount'],
            labels: ['Count'],
            type: 'line'
          }}
          y2={{
            formatter: micros.detailed,
            metrics: ['stats.averageSqlExecuteTime'],
            labels: ['Average Time'],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="SQL Parse Count">
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            formatter: number.compact,
            metrics: ['stats.hardParseCount', 'stats.totalParseCount'],
            labels: ['Hard Parse', 'Total Parse'],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="SQL Parse Ratios">
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            max: 1,
            formatter: hitRateTwoDecimalPlaces,
            metrics: ['stats.softTotalParsesRatio', 'stats.executesWithoutParsesRatio'],
            labels: ['Soft / Total', 'Without Parses'],
            type: 'area'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="User Calls Commits Rollbacks">
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            formatter: number.compact,
            metrics: [
              'stats.userCalls',
              'stats.recursiveCalls',
              'stats.userCommits',
              'stats.userRollbacks',
              'stats.userLogOns'
            ],
            labels: ['User Calls', 'Recursive Calls', 'User Commits', 'User Rollbacks', 'User Log Ons'],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="Physical and Session Logical Reads">
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            formatter: number.compact,
            metrics: ['stats.physicalReads', 'stats.sessionLogicalReads'],
            labels: ['Physical', 'Logical'],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="Buffer Cache Hit">
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            max: 1,
            formatter: hitRateTwoDecimalPlaces,
            metrics: ['stats.bufferCacheHitRatio'],
            labels: ['Ratio'],
            type: 'area'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="Sessions">
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            formatter: number.compact,
            metrics: ['stats.activeUserSessions', 'stats.inactiveUserSessions', 'stats.backgroundSessions'],
            labels: ['Active User', 'Inactive User', 'Background'],
            type: 'stackedArea'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="Used Sessions Ratio">
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            max: 1,
            formatter: percentageTwoDecimalPlaces,
            metrics: ['stats.usedSessionsRatio'],
            labels: ['Sessions / Session Limit'],
            type: 'area'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <TablespaceUsagesTable snapshot={snapshot} timeConfig={timeConfig} />

      <DBmarlinNotificationMessage />
    </div>
  );
}
