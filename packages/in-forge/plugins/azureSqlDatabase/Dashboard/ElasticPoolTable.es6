import React from 'react';

import Table from 'in-sdk/components/dashboard/Table';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { emptyMap } from 'in-services/fixedImmutables';
import Chart from 'in-components/Chart';
import {
  zeroDecimalPlaces,
  percentage,
  percentagePlainTwoDecimalPlaces,
  bytesTwoDecimalPlaces
} from 'in-services/formatters/number';

const cols = [
  {
    title: 'Name',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.pool.get('name');
      }
    }
  },
  {
    title: 'Location',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.pool.get('location');
      }
    }
  },
  {
    title: 'State',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.pool.get('state');
      }
    }
  },
  {
    title: 'SKU',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.pool.get('sku');
      }
    }
  },
  {
    title: 'Min eDTUs',
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.pool.get('minCapacity');
      },
      getContent: zeroDecimalPlaces
    }
  },
  {
    title: 'Max eDTUs',
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.pool.get('maxCapacity');
      },
      getContent: zeroDecimalPlaces
    }
  },
  {
    title: 'eDTU Used',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `metrics.elasticPools.${row.key}.dtu_consumption_percent`;
      },
      getContent: percentage.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Max Size',
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.pool.get('maxSizeBytes');
      },
      getContent: bytesTwoDecimalPlaces
    }
  },
  {
    title: 'Storage Used (bytes)',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `metrics.elasticPools.${row.key}.storage_used`;
      },
      getContent: bytesTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'max';
      }
    }
  },
  {
    title: 'Storage Used (%)',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `metrics.elasticPools.${row.key}.storage_percent`;
      },
      getContent: percentagePlainTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'max';
      }
    }
  },
  {
    title: 'CPU',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `metrics.elasticPools.${row.key}.cpu_percent`;
      },
      getContent: percentage.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function ElasticPoolTable({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  const rows = snapshot
    .getIn(['data', 'elasticPools'], emptyMap)
    .map((pool, key) => {
      return {
        key,
        pool,
        timeConfig,
        snapshotId
      };
    })
    .toArray();

  if (rows.length === 0) {
    return null;
  }

  return (
    <DashboardSection title={`Elastic Pools (${rows.length})`}>
      <Table cols={cols} rows={rows} getRowDetails={getRowDetails} />
    </DashboardSection>
  );
}

function getRowDetails(row) {
  return (
    <div>
      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          formatter: zeroDecimalPlaces,
          metrics: [
            'metrics.elasticPools.' + row.key + '.eDTU_limit',
            'metrics.elasticPools.' + row.key + '.eDTU_used'
          ],
          labels: ['eDTU Limit', 'eDTU Used'],
          type: 'line'
        }}
        y2={{
          formatter: percentagePlainTwoDecimalPlaces,
          metrics: ['metrics.elasticPools.' + row.key + '.dtu_consumption_percent'],
          labels: ['eDTU Percentage'],
          type: 'bar'
        }}
      />

      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          formatter: bytesTwoDecimalPlaces,
          metrics: [
            'metrics.elasticPools.' + row.key + '.storage_limit',
            'metrics.elasticPools.' + row.key + '.storage_used'
          ],
          labels: ['Storage Limit', 'Storage Used'],
          type: 'line'
        }}
        y2={{
          formatter: percentagePlainTwoDecimalPlaces,
          metrics: ['metrics.elasticPools.' + row.key + '.storage_percent'],
          labels: ['Storage percentage'],
          type: 'bar'
        }}
      />

      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          formatter: percentagePlainTwoDecimalPlaces,
          metrics: ['metrics.elasticPools.' + row.key + '.cpu_percent'],
          labels: ['CPU percentage'],
          type: 'line'
        }}
      />

      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          formatter: percentagePlainTwoDecimalPlaces,
          metrics: [
            'metrics.elasticPools.' + row.key + '.physical_data_read_percent',
            'metrics.elasticPools.' + row.key + '.log_write_percent',
            'metrics.elasticPools.' + row.key + '.xtp_storage_percent',
            'metrics.elasticPools.' + row.key + '.workers_percent',
            'metrics.elasticPools.' + row.key + '.sessions_percent'
          ],
          labels: ['Data IO', 'Log IO', 'In-Memory OLTP storage', 'Workers', 'Sessions'],
          type: 'line'
        }}
      />
    </div>
  );
}
