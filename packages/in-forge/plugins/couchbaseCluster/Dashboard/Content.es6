import React from 'react';

import { number } from 'in-services/formatters/number';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart';

import ClusterSummary from 'in-forge/plugins/couchbaseCluster/Dashboard/ClusterSummary';
import ClusterNodesTable from 'in-forge/plugins/couchbaseCluster/Dashboard/ClusterNodesTable';
import BucketsTable from 'in-forge/plugins/couchbaseNode/Dashboard/BucketsTable';
import { BUCKET_METRICS_PREFIX } from 'in-forge/plugins/couchbaseCluster/constants.es6';

export default function CouchbaseClusterDashboard({ snapshot, timeframe }) {
  return (
    <div>
      <ClusterSummary snapshot={snapshot} />

      <DashboardSection title="Throughput">
        <Chart
          snapshotId={snapshot.get('id')}
          timeframe={timeframe}
          y1={{
            min: 0,
            formatter: number.perSecond.compact,
            metrics: ['cluster.ops', 'cluster.cmd_get', 'cluster.cmd_set'],
            labels: ['Operations per sec.', 'Gets per sec.', 'Sets per sec.'],
            type: 'line'
          }}
        />
      </DashboardSection>

      <ClusterNodesTable clusterSnapshotId={snapshot.get('id')} timeframe={timeframe} />

      <BucketsTable snapshot={snapshot} timeframe={timeframe} bucketMetricsPrefix={BUCKET_METRICS_PREFIX} />
    </div>
  );
}
