import React from 'react';

import { emptyList } from 'in-services/fixedImmutables';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart';
import Table from 'in-sdk/components/dashboard/Table';
import {
  withSiMultiplyPrefixZeroDecimalPlaces,
  bytesZeroDecimalPlaces,
  bytesTwoDecimalPlaces,
  zeroDecimalPlaces,
  number
} from 'in-services/formatters/number';

const cols = [
  {
    title: 'Index',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.name;
      }
    }
  },
  {
    title: 'Shards',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `index.${row.name}.number_of_shards`;
      },
      getContent: withSiMultiplyPrefixZeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Replicas',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `index.${row.name}.number_of_replicas`;
      },
      getContent: withSiMultiplyPrefixZeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Documents',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `index.${row.name}.document_count`;
      },
      getContent: withSiMultiplyPrefixZeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Deleted',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `index.${row.name}.deleted_count`;
      },
      getContent: withSiMultiplyPrefixZeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Total queries',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `index.${row.name}.query_total`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'max';
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
        return `index.${row.name}.size`;
      },
      getContent: bytesTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Metadata Size',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `clusterState.indices.${row.name}.indexMetadataSize`;
      },
      getContent: bytesTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function IndicesTable({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  const rows = snapshot
    .getIn(['data', 'index_names'], emptyList)
    .toArray()
    .map(name => {
      return {
        key: name,
        name,
        timeConfig,
        snapshotId
      };
    });

  if (rows.length === 0) {
    return null;
  }

  return (
    <DashboardSection title={`Index Details (${rows.length})`}>
      <Table cols={cols} rows={rows} getRowDetails={getDetails} />
    </DashboardSection>
  );
}

function getDetails(row) {
  return (
    <Chart
      snapshotId={row.snapshotId}
      timeConfig={row.timeConfig}
      y1={{
        metrics: ['index.' + row.name + '.document_count', 'index.' + row.name + '.deleted_count'],
        labels: ['Documents', 'Deletions'],
        formatter: withSiMultiplyPrefixZeroDecimalPlaces,
        tooltipFormatter: zeroDecimalPlaces,
        type: 'line'
      }}
      y2={{
        metrics: ['index.' + row.name + '.size', 'clusterState.indices.' + row.name + '.indexMetadataSize'],
        labels: ['Size', 'Metadata Size'],
        formatter: bytesZeroDecimalPlaces,
        tooltipFormatter: bytesTwoDecimalPlaces,
        type: 'line'
      }}
    />
  );
}
