import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { number, bytes, seconds } from 'in-services/formatters/number';
import Chart from 'in-components/Chart';

export default function AwsEcRedisDashboard({ snapshot, timeframe }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <DashboardSection title="Bytes Used">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          margins={{
            left: 80
          }}
          y1={{
            min: 0,
            metrics: ['bytes_used_for_cache'],
            labels: ['Bytes used'],
            type: 'line',
            formatter: bytes.compact
          }}
        />
      </DashboardSection>
      <DashboardSection title="Cache">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          margins={{
            left: 80
          }}
          y1={{
            min: 0,
            metrics: ['cache_hits', 'cache_misses'],
            labels: ['Hits', 'Misses'],
            type: 'line',
            formatter: number.compact
          }}
        />
      </DashboardSection>
      <DashboardSection title="Replication">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          margins={{
            left: 80,
            right: 40
          }}
          y1={{
            min: 0,
            metrics: ['replication_bytes'],
            labels: ['Replication Bytes'],
            type: 'line',
            formatter: bytes.compact
          }}
          y2={{
            min: 0,
            metrics: ['replication_lag'],
            labels: ['Replication Lag'],
            type: 'line',
            formatter: seconds.fixedCompact
          }}
        />
      </DashboardSection>
      <DashboardSection title="Commands">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          margins={{
            left: 80
          }}
          y1={{
            min: 0,
            metrics: [
              'get_type_cmds',
              'hash_based_cmds',
              'key_based_cmds',
              'list_based_cmds',
              'set_based_cmds',
              'sorted_set_based_cmds',
              'string_based_cmds',
              'hyper_log_log_based_cmds'
            ],
            labels: ['Get', 'Hash', 'Key', 'List', 'Set', 'Sorted Set', 'Strings', 'Hyper Log'],
            type: 'line',
            formatter: number.compact
          }}
        />
      </DashboardSection>
    </div>
  );
}
