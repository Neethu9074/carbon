import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ChartWithLegend from 'in-components/ChartWithLegend';
import { emptyMap } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';
import { number } from 'in-services/formatters/number';

const cols = [
  {
    title: 'Name',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.datasource.get('name');
      }
    }
  },
  {
    title: 'Context',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.datasource.get('context');
      }
    }
  },
  {
    title: 'URL',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.datasource.get('url');
      }
    }
  },
  {
    title: 'Active',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `datasources.${row.key}.active`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Max',
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.datasource.get('max');
      },
      getContent(value) {
        return value == null || value === -1 ? 'unlimited' : number.compact(value);
      }
    }
  }
];

export default function DataSourcesTable({ snapshot, timeframe }) {
  const snapshotId = snapshot.get('id');
  const rows = snapshot
    .getIn(['data', 'datasource-config'], emptyMap)
    .map((datasource, id) => {
      return {
        key: id,
        datasource,
        timeframe,
        snapshotId
      };
    })
    .valueSeq()
    .toArray();

  if (rows.length === 0) {
    return null;
  }

  return (
    <DashboardSection title={`Data Sources (${rows.length})`}>
      <Table cols={cols} rows={rows} getRowDetails={getRowDetails} />
    </DashboardSection>
  );
}

function getRowDetails(row) {
  return (
    <ChartWithLegend
      snapshotId={row.snapshotId}
      timeframe={row.timeframe}
      margins={{
        left: 80
      }}
      y1={{
        metrics: ['datasources.' + row.key + '.active'],
        labels: ['Active connections'],
        type: 'line'
      }}
    />
  );
}
