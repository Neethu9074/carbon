/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { millis, number } from 'in-services/formatters/number';
import { yesOrNo } from 'in-services/formatters/boolean';
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
    title: 'Container Mode',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return yesOrNo(row.config.get('containerMode'));
      }
    }
  },
  {
    title: 'Processed Events',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `applications.${row.key}.processedEvents`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'sum';
      }
    }
  },
  {
    title: 'Execution Errors',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `applications.${row.key}.executionErrors`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'sum';
      }
    }
  },
  {
    title: 'Fatal Errors',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `applications.${row.key}.fatalErrors`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'sum';
      }
    }
  },
  {
    title: 'Processing time',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `applications.${row.key}.avgProcessingTime`;
      },
      getContent: millis.fixedCompact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Shutdown Timeout',
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.config.get('shutdownTimeout');
      },
      getContent(value) {
        return millis.compact(value);
      }
    }
  },
  {
    title: 'Sync Event Timeout',
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.config.get('synchronousEventTimeout');
      },
      getContent(value) {
        return millis.compact(value);
      }
    }
  },
  {
    title: 'Transaction Timeout',
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.config.get('transactionTimeout');
      },
      getContent(value) {
        return millis.compact(value);
      }
    }
  }
];

export default function ApplicationsTable({ snapshot, timeConfig }) {
  const data = snapshot.get('data');
  const rows = data
    .getIn(['configurations'], emptyList)
    .map((config, key) => {
      const app = data.getIn(['applications', key], emptyList);
      return {
        key,
        snapshotId: snapshot.get('id'),
        timeConfig: timeConfig,
        config,
        app
      };
    })
    .toArray();

  if (rows.length === 0) {
    return null;
  }

  return (
    <Table
      withoutPadding
      cardTitle={`Applications (${rows.length})`}
      cols={cols}
      rows={rows}
      getRowDetails={getDetails}
    />
  );
}

function getDetails(row) {
  return (
    <Chart
      snapshotId={row.snapshotId}
      timeConfig={row.timeConfig}
      y1={{
        metrics: [
          'applications.' + row.key + '.processedEvents',
          'applications.' + row.key + '.executionErrors',
          'applications.' + row.key + '.fatalErrors'
        ],
        labels: ['Processed events', 'Execution errors', 'Fatal errors'],
        formatter: number.compact,
        tooltipFormatter: number.compact,
        type: 'line'
      }}
      y2={{
        metrics: ['applications.' + row.key + '.avgProcessingTime'],
        labels: ['Average processing time'],
        formatter: millis.fixedCompact,
        type: 'line'
      }}
      renderPostChartContent={PluginDashboardsMarkerLanes}
    />
  );
}
