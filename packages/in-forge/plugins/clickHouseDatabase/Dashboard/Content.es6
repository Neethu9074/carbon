import React from 'react';

import { KpiSection, KpiHeading, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import DashboardNotification from 'in-components/DashboardNotification';
import Columize from 'in-sdk/components/dashboard/Columize';
import { number } from 'in-services/formatters/number';
import MetricValue from 'in-components/MetricValue';
import { getLabel } from 'in-sdk/snapshot';
import Chart from 'in-components/Chart';

export default function ClickHouseDashboard({ snapshot, timeframe }) {
  const snapshotId = snapshot.get('id');
  const sensorConnectionStatus = snapshot.getIn(['data', 'sensorConnectionStatus'], 'OK');

  if (sensorConnectionStatus !== 'OK') {
    return <DashboardNotification type="info">{sensorConnectionStatus}</DashboardNotification>;
  }

  return (
    <div>
      <KpiSection>
        <KpiHeading>{getLabel(snapshot)}</KpiHeading>
        <KpiKeyValue label="Query Thread">
          <MetricValue snapshotId={snapshotId} metric="QueryThread" formatter={number.compact} />
        </KpiKeyValue>
        <KpiKeyValue label="Query Preempted">
          <MetricValue snapshotId={snapshotId} metric="QueryPreempted" formatter={number.compact} />
        </KpiKeyValue>
        <KpiKeyValue label="Read">
          <MetricValue snapshotId={snapshotId} metric="Read" formatter={number.compact} />
        </KpiKeyValue>
        <KpiKeyValue label="Write">
          <MetricValue snapshotId={snapshotId} metric="Write" formatter={number.compact} />
        </KpiKeyValue>
        <KpiKeyValue label="Merge">
          <MetricValue snapshotId={snapshotId} metric="Merge" formatter={number.compact} />
        </KpiKeyValue>
      </KpiSection>
      <Columize>
        <DashboardSection title="Query">
          <Chart
            snapshotId={snapshotId}
            timeframe={timeframe}
            y1={{
              min: 0,
              metrics: ['QueryThread'],
              labels: ['Query Thread'],
              type: 'line'
            }}
            y2={{
              min: 0,
              metrics: ['Query Preempted'],
              labels: ['QueryPreempted'],
              type: 'line'
            }}
          />
        </DashboardSection>
        <DashboardSection title="Merge">
          <Chart
            snapshotId={snapshotId}
            timeframe={timeframe}
            y1={{
              min: 0,
              metrics: ['Merge'],
              labels: ['Merge'],
              type: 'line'
            }}
          />
        </DashboardSection>
      </Columize>
      <Columize>
        <DashboardSection title="Reads versus Writes">
          <Chart
            snapshotId={snapshotId}
            timeframe={timeframe}
            y1={{
              min: 0,
              metrics: ['Read'],
              labels: ['Reads'],
              type: 'line',
              formatter: number.compact
            }}
            y2={{
              min: 0,
              metrics: ['Write'],
              labels: ['Writes'],
              type: 'line',
              formatter: number.compact
            }}
          />
        </DashboardSection>
        <DashboardSection title="Tasks">
          <Chart
            snapshotId={snapshotId}
            timeframe={timeframe}
            y1={{
              min: 0,
              metrics: ['BackgroundPoolTask'],
              labels: ['Background Pool Tasks'],
              type: 'line',
              formatter: number.compact
            }}
          />
        </DashboardSection>
      </Columize>
      <Columize>
        <DashboardSection title="Connections">
          <Chart
            snapshotId={snapshotId}
            timeframe={timeframe}
            y1={{
              min: 0,
              metrics: ['HTTPConnection', 'TCPConnection', 'InterserverConnection'],
              labels: ['HTTP Connections', 'TCP Connections', 'Interserver'],
              type: 'line'
            }}
          />
        </DashboardSection>
        <DashboardSection title="Memory">
          <Chart
            snapshotId={snapshotId}
            timeframe={timeframe}
            y1={{
              min: 0,
              metrics: ['MemoryTracking', 'MemoryTrackingInBackgroundProcessingPool', 'MemoryTrackingForMerges'],
              labels: ['Memory Tracking', 'Background Processing Pool', 'For Merges'],
              type: 'line'
            }}
          />
        </DashboardSection>
      </Columize>
      <DashboardSection title="File IO">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          y1={{
            min: 0,
            metrics: ['OpenFileForRead', 'OpenFileForWrite'],
            labels: ['Open Files (Read)', 'Open Files (Write)'],
            type: 'line'
          }}
        />
      </DashboardSection>
      {
        // More available metrics:
        // OpenFileForRead
        // OpenFileForWrite
        // DiskSpaceReservedForMerge
        // DelayedInserts
        // ReplicatedFetch
        // ReplicatedSend
        // ReplicatedChecks
        // ReadonlyReplica
        // LeaderReplica
        // LeaderElection
        // BackgroundPoolTask
        // DistributedSend
        // QueryPreempted
        // SendExternalTables
        // QueryThread
        // EphemeralNode
        // ZooKeeperWatch
        // ContextLockWait
        // StorageBufferRows
        // StorageBufferBytes
        // DictCacheRequests
        // Revision
        // RWLockWaitingReaders
        // RWLockWaitingWriters
        // RWLockActiveReaders
        // RWLockActiveWriters
      }
    </div>
  );
}
