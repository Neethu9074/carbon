import React from 'react';

import {
  zeroDecimalPlaces,
  hitRateTwoDecimalPlaces,
  muSecondsToMillisTwoDecimalPlaces,
  msZeroDecimalPlaces,
  percentageTwoDecimalPlaces
} from 'in-services/formatters/number';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import DashboardNotification from 'in-components/DashboardNotification';
import ChartWithLegend from 'in-components/ChartWithLegend';

import TablespaceUsagesTable from './TablespaceUsagesTable.es6';

export default function OracleDBDashboard({ snapshot, timeframe }) {
  const sensorConnectionStatus = snapshot.getIn(['data', 'sensorConnectionStatus'], 'OK');
  if (sensorConnectionStatus !== 'OK') {
    return (
      <DashboardNotification type="info">
        {sensorConnectionStatus}
      </DashboardNotification>
    );
  }

  return (
    <div>
      <DashboardSection title="DB Time per Second">
        <ChartWithLegend
          snapshotId={snapshot.get('id')}
          timeframe={timeframe}
          margins={{
            left: 80
          }}
          y1={{
            formatter: muSecondsToMillisTwoDecimalPlaces,
            metrics: ['stats.dbTime', 'stats.cpuTime', 'stats.sqlExecuteTime', 'stats.parseTime'],
            labels: ['DB Time', 'DB CPU Time', 'SQL Execute Time', 'Parse Time'],
            type: 'line'
          }}
        />
      </DashboardSection>
      <DashboardSection title="DB CPU Time/DB Time Ratio">
        <ChartWithLegend
          snapshotId={snapshot.get('id')}
          timeframe={timeframe}
          margins={{
            left: 80
          }}
          y1={{
            min: 0,
            max: 1,
            formatter: hitRateTwoDecimalPlaces,
            metrics: ['stats.cpuTimeDbTimeRatio'],
            labels: ['DB CPU Time/DB Time Ratio'],
            type: 'area'
          }}
        />
      </DashboardSection>
      <DashboardSection title="Time Waited per Second">
        <ChartWithLegend
          snapshotId={snapshot.get('id')}
          timeframe={timeframe}
          height={200}
          margins={{
            left: 80
          }}
          y1={{
            formatter: msZeroDecimalPlaces,
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
        />
      </DashboardSection>
      <DashboardSection title="Sql Execution">
        <ChartWithLegend
          snapshotId={snapshot.get('id')}
          timeframe={timeframe}
          margins={{
            left: 80,
            right: 40
          }}
          y1={{
            formatter: zeroDecimalPlaces,
            metrics: ['stats.sqlExecuteCount'],
            labels: ['Sql Execute Count'],
            type: 'line'
          }}
          y2={{
            formatter: muSecondsToMillisTwoDecimalPlaces,
            metrics: ['stats.averageSqlExecuteTime'],
            labels: ['Average Sql Execution Time'],
            type: 'line'
          }}
        />
      </DashboardSection>
      <DashboardSection title="Sql Parse Count">
        <ChartWithLegend
          snapshotId={snapshot.get('id')}
          timeframe={timeframe}
          margins={{
            left: 80
          }}
          y1={{
            formatter: zeroDecimalPlaces,
            metrics: ['stats.hardParseCount', 'stats.totalParseCount'],
            labels: ['Hard Parse Count', 'Total Parse Count'],
            type: 'line'
          }}
        />
      </DashboardSection>
      <DashboardSection title="Sql Parse Ratios">
        <ChartWithLegend
          snapshotId={snapshot.get('id')}
          timeframe={timeframe}
          margins={{
            left: 80
          }}
          y1={{
            min: 0,
            max: 1,
            formatter: hitRateTwoDecimalPlaces,
            metrics: ['stats.softTotalParsesRatio', 'stats.executesWithoutParsesRatio'],
            labels: ['Soft/Total Parse Ratio', 'Executes Without Parses Ratio'],
            type: 'area'
          }}
        />
      </DashboardSection>
      <DashboardSection title="User Calls Commits Rollbacks">
        <ChartWithLegend
          snapshotId={snapshot.get('id')}
          timeframe={timeframe}
          margins={{
            left: 80
          }}
          y1={{
            formatter: zeroDecimalPlaces,
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
        />
      </DashboardSection>
      <DashboardSection title="Physical and Session Logical Reads">
        <ChartWithLegend
          snapshotId={snapshot.get('id')}
          timeframe={timeframe}
          margins={{
            left: 80
          }}
          y1={{
            formatter: zeroDecimalPlaces,
            metrics: ['stats.physicalReads', 'stats.sessionLogicalReads'],
            labels: ['Physical Reads', 'Session Logical Reads'],
            type: 'line'
          }}
        />
      </DashboardSection>
      <DashboardSection title="Buffer Cache Hit Ratio">
        <ChartWithLegend
          snapshotId={snapshot.get('id')}
          timeframe={timeframe}
          margins={{
            left: 80
          }}
          y1={{
            min: 0,
            max: 1,
            formatter: hitRateTwoDecimalPlaces,
            metrics: ['stats.bufferCacheHitRatio'],
            labels: ['Buffer Cache Hit Ratio'],
            type: 'area'
          }}
        />
      </DashboardSection>
      <DashboardSection title="Sessions">
        <ChartWithLegend
          snapshotId={snapshot.get('id')}
          timeframe={timeframe}
          margins={{
            left: 80
          }}
          y1={{
            formatter: zeroDecimalPlaces,
            metrics: ['stats.activeUserSessions', 'stats.inactiveUserSessions', 'stats.backgroundSessions'],
            labels: ['Active User Sessions', 'Inactive User Sessions', 'Background Sessions'],
            type: 'stackedArea'
          }}
        />
      </DashboardSection>
      <DashboardSection title="Used Sessions Ratio">
        <ChartWithLegend
          snapshotId={snapshot.get('id')}
          timeframe={timeframe}
          margins={{
            left: 80
          }}
          y1={{
            min: 0,
            max: 1,
            formatter: percentageTwoDecimalPlaces,
            metrics: ['stats.usedSessionsRatio'],
            labels: ['Sessions/Session Limit'],
            type: 'area'
          }}
        />
      </DashboardSection>
      <TablespaceUsagesTable snapshot={snapshot} timeframe={timeframe} />
    </div>
  );
}
