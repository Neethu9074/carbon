/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { millis, number } from 'in-services/formatters/number';
import { emptyMap } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';

const cols = [
  {
    title: 'Name',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.flowName;
      }
    }
  },
  {
    title: 'Application',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.appName;
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
        return `flows.${row.key}.processedEvents`;
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
        return `flows.${row.key}.executionErrors`;
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
        return `flows.${row.key}.fatalErrors`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'sum';
      }
    }
  },
  {
    title: 'Processing Time',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `flows.${row.key}.avgProcessingTime`;
      },
      getContent: millis.fixedCompact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function FlowsTable({ snapshot, timeConfig }) {
  const data = snapshot.get('data');
  const rows = data
    .getIn(['flowNames'], emptyMap)
    .map((appName, flowName) => {
      return {
        key: appName + '_' + flowName,
        appName,
        flowName,
        snapshotId: snapshot.get('id'),
        timeConfig: timeConfig
      };
    })
    .toArray();

  if (rows.length === 0) {
    return null;
  }

  return (
    <Table withoutPadding cardTitle={`Flows (${rows.length})`} cols={cols} rows={rows} getRowDetails={getDetails} />
  );
}

function getDetails(row) {
  return (
    <Chart
      snapshotId={row.snapshotId}
      timeConfig={row.timeConfig}
      y1={{
        min: 0,
        metrics: [
          'flows.' + row.key + '.processedEvents',
          'flows.' + row.key + '.executionErrors',
          'flows.' + row.key + '.fatalErrors'
        ],
        labels: ['Processed events', 'Execution errors', 'Fatal errors'],
        formatter: number.compact,
        tooltipFormatter: number.compact,
        type: 'line'
      }}
      y2={{
        min: 0,
        metrics: ['flows.' + row.key + '.avgProcessingTime'],
        labels: ['Average processing time'],
        formatter: millis.fixedCompact,
        type: 'line'
      }}
      renderPostChartContent={PluginDashboardsMarkerLanes}
    />
  );
}
