import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import Table from 'in-sdk/components/dashboard/Table';
import { bytesZeroDecimalPlaces, seconds } from 'in-services/formatters/number';

const cols = [
  {
    title: 'Replication',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  }
];

export default function ReplicationsTable({ snapshot, timeConfig }) {
  let replications = snapshot.getIn(['data', 'replications']);
  if (!replications) {
    return null;
  }

  const rows = replications
    .toArray()
    .sort()
    .map(replication => {
      return {
        key: replication,
        snapshotId: snapshot.get('id'),
        timeConfig,
        snapshot
      };
    });

  return <Table withoutPadding cardTitle="Replications" cols={cols} rows={rows} getRowDetails={getRowDetails} />;
}

function getRowDetails(row) {
  const snapshotId = row.snapshotId;
  const timeConfig = row.timeConfig;

  return (
    <div>
      <DashboardSection title="Delays">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: bytesZeroDecimalPlaces,
            metrics: ['replication_stats.' + row.key + '.replication_delay_bytes'],
            labels: ['Replication delay in bytes'],
            type: 'line'
          }}
          y2={{
            min: 0,
            formatter: seconds.fixedCompact,
            metrics: ['replication_stats.' + row.key + '.replication_delay_seconds'],
            labels: ['Replication delay in seconds'],
            type: 'line'
          }}
        />
      </DashboardSection>
    </div>
  );
}
