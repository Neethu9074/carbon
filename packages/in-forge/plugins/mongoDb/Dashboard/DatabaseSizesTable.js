import React from 'react';

import { bytesZeroDecimalPlaces, bytesTwoDecimalPlaces } from 'in-services/formatters/number';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';

const cols = [
  {
    title: 'Name',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  },
  {
    title: 'Size',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `dbs.${row.key}`;
      },
      getContent: bytesZeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function DatabaseTable({ snapshot, timeConfig }) {
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
    <Table withoutPadding cardTitle={`Databases (${rows.length})`} cols={cols} rows={rows} getRowDetails={getDetails} />
  );
}

function getDetails(row) {
  return (
    <div>
      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          formatter: bytesZeroDecimalPlaces,
          tooltipFormatter: bytesTwoDecimalPlaces,
          metrics: ['dbs.' + row.key],
          labels: ['Database Size'],
          type: 'line'
        }}
      />
    </div>
  );
}
