import React from 'react';

import { zeroDecimalPlaces, bytesZeroDecimalPlaces, bytesTwoDecimalPlaces } from 'in-services/formatters/number';
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

export default function DatabasesTable({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  const rows = snapshot
    .getIn(['data', 'databases'], emptyList)
    .toArray()
    .map(name => {
      return {
        key: name,
        snapshotId,
        timeConfig
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
          timeConfig={row.timeConfig}
          y1={{
            metrics: ['generalstats.' + row.key + '.user_connections'],
            labels: ['User Connections'],
            type: 'line',
            formatter: zeroDecimalPlaces,
            tooltipFormatter: zeroDecimalPlaces
          }}
        />
      </DashboardSection>
      <DashboardSection title="Virtual File Reads &amp; Writes (bytes)">
        <Chart
          snapshotId={row.snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            metrics: ['iostats.' + row.key + '.num_of_bytes_read', 'iostats.' + row.key + '.num_of_bytes_written'],
            labels: ['Reads', 'Writes'],
            type: 'line',
            formatter: bytesZeroDecimalPlaces,
            tooltipFormatter: bytesTwoDecimalPlaces
          }}
        />
      </DashboardSection>
      <DashboardSection title="Transactions">
        <Chart
          snapshotId={row.snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            metrics: [
              'perfcounters.databases.' + row.key.toLowerCase().replace(/\./g, '_') + '.write_transactions_sec'
            ],
            labels: ['Write Transactions'],
            type: 'line',
            formatter: zeroDecimalPlaces,
            tooltipFormatter: zeroDecimalPlaces
          }}
        />
      </DashboardSection>
    </div>
  );
}
