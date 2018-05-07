import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { bytes, kiloBytes } from 'in-services/formatters/number';
import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';
import Chart from 'in-components/Chart';

const cols = [
  {
    title: 'Monitor Name',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  },
  {
    title: 'Status',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'mon.' + row.key + '.health';
      },
      getContent(value) {
        if (value === 0) {
          return 'OK';
        } else if (value === 1) {
          return 'WARNING';
        } else {
          return 'CRITICAL';
        }
      },
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function MonTable({ snapshot, timeConfig }) {
  const mons = snapshot.getIn(['data', 'monsList'], emptyList);
  if (mons.size === 0) {
    return null;
  }
  const rows = mons
    .map(mon => {
      return {
        key: mon,
        timeConfig,
        snapshotId: snapshot.get('id')
      };
    })
    .toArray();

  return (
    <DashboardSection title={`Mons (${rows.length})`}>
      <Table cols={cols} rows={rows} getRowDetails={getDetails} />
    </DashboardSection>
  );
}

function getDetails(row) {
  const id = row.key;
  return (
    <div>
      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          min: 0,
          metrics: [
            'mons.' + id + '.bytes_total',
            'mons.' + id + '.bytes_sst',
            'mons.' + id + '.bytes_log',
            'mons.' + id + '.bytes_misc'
          ],
          labels: ['Total', 'Sst', 'Log', 'Misc'],
          type: 'line',
          formatter: bytes.compact
        }}
      />
      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          min: 0,
          metrics: ['mons.' + id + '.kb_total', 'mons.' + id + '.kb_used'],
          labels: ['Total', 'Used'],
          type: 'line',
          formatter: kiloBytes.compact
        }}
      />
    </div>
  );
}
