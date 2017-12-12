import React from 'react';
import semver from 'semver';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import AwsEcNewMemcachedDashboard from './AwsEcNewMemcachedDashboard';
import Columize from 'in-sdk/components/dashboard/Columize';
import { number, bytes } from 'in-services/formatters/number';
import Chart from 'in-components/Chart';

export default function AwsEcMemcachedDashboard({ snapshot, timeframe }) {
  const snapshotId = snapshot.get('id');
  const v = snapshot.getIn(['data', 'cache_engine_version']);
  const newVersion = semver.satisfies(v, '>=1.4.14');

  return (
    <div>
      <DashboardSection title="Bytes used">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          y1={{
            min: 0,
            metrics: ['bytes_read_into_memcached', 'bytes_written_out_from_memcached', 'bytes_used_for_cache_items'],
            labels: ['Bytes read', 'Bytes written', 'Bytes Used'],
            type: 'line',
            formatter: bytes.compact
          }}
        />
      </DashboardSection>
      <DashboardSection title="Cache">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          y1={{
            min: 0,
            metrics: ['cas_hits', 'cas_misses', 'cas_badval'],
            labels: ['Hits', 'Misses', 'Bad value'],
            type: 'line',
            formatter: number.compact
          }}
        />
      </DashboardSection>
      <DashboardSection title="Commands">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          y1={{
            min: 0,
            metrics: ['cmd_flush', 'cmd_get', 'cmd_set'],
            labels: ['Flush', 'Get', 'Set'],
            type: 'line',
            formatter: bytes.compact
          }}
        />
      </DashboardSection>
      <Columize>
        <DashboardSection title="Operations">
          <Chart
            snapshotId={snapshotId}
            timeframe={timeframe}
            y1={{
              min: 0,
              metrics: ['get_hits', 'get_misses', 'delete_hits', 'delete_misses'],
              labels: ['Get Hits', 'Get Misses', 'Delete Hits', 'Delete Misses'],
              type: 'line',
              formatter: number.compact
            }}
          />
        </DashboardSection>
        <DashboardSection title="Operations">
          <Chart
            snapshotId={snapshotId}
            timeframe={timeframe}
            y1={{
              min: 0,
              metrics: ['incr_hits', 'incr_misses', 'decr_hits', 'decr_misses'],
              labels: ['Incr Hits', 'Incr Misses', 'Decr Hits', 'Decr Misses'],
              type: 'line',
              formatter: number.compact
            }}
          />
        </DashboardSection>
      </Columize>
      <DashboardSection title="Unused Memory">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          y1={{
            min: 0,
            metrics: ['unused_memory'],
            labels: ['Unused Memory'],
            type: 'line',
            formatter: bytes.compact
          }}
        />
      </DashboardSection>

      {newVersion ? <AwsEcNewMemcachedDashboard snapshot={snapshot} timeframe={timeframe} /> : null}
    </div>
  );
}
