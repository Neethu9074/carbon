import React from 'react';

import { emptyList } from 'in-services/fixedImmutables';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Table from 'in-sdk/components/dashboard/Table';
import Chart from 'in-components/Chart';

const cols = [
  {
    title: 'Schema',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  }
];

export default function DatabasesTable({ snapshot, timeframe }) {
  const snapshotId = snapshot.get('id');
  const rows = snapshot
    .getIn(['data', 'databases'], emptyList)
    .toArray()
    .map(name => {
      return {
        key: name,
        snapshotId,
        timeframe
      };
    });

  if (rows.length === 0) {
    return null;
  }

  return (
    <DashboardSection title={`Databases (${rows.length})`}>
      <Table cols={cols} rows={rows} getRowDetails={getDetails} />
    </DashboardSection>
  );
}

function getDetails(row) {
  return (
    <div>
      <DashboardSection title="Connections &amp; Users">
        <Chart
          snapshotId={row.snapshotId}
          timeframe={row.timeframe}
          y1={{
            metrics: ['generalstats.' + row.key + '.user_connections'],
            labels: ['Connections'],
            type: 'line'
          }}
        />
      </DashboardSection>
      <DashboardSection title="Read &amp; Write (bytes)">
        <Chart
          snapshotId={row.snapshotId}
          timeframe={row.timeframe}
          y1={{
            metrics: ['iostats.' + row.key + '.num_of_bytes_read', 'iostats.' + row.key + '.num_of_bytes_written'],
            labels: ['Read', 'Write'],
            type: 'line'
          }}
        />
      </DashboardSection>
    </div>
  );
}
