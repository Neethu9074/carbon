/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { withSiPrefixThreeDecimalPlaces } from 'in-services/formatters/number';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';

const cols = [
  {
    title: 'Name',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.name;
      }
    }
  },
  {
    title: 'Value',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `jmx.${row.name}`;
      },
      getContent: withSiPrefixThreeDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function JmxMetricsTable({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');

  const rows = getMetricIds(snapshot)
    .toArray()
    .map(name => {
      return {
        name,
        key: name,
        snapshotId,
        timeConfig
      };
    });

  if (rows.length === 0) {
    return null;
  }

  return (
    <Table
      withoutPadding
      cardTitle={`Custom JMX Metrics (${rows.length})`}
      cols={cols}
      rows={rows}
      getRowDetails={getRowDetails}
    />
  );
}

export function getMetricIds(snapshot) {
  const metricIds = snapshot.get('metricIds');
  if (metricIds) {
    return metricIds.filter(id => id.startsWith('jmx.')).map(id => id.slice(id.indexOf('.') + 1));
  }

  return snapshot.getIn(['data', 'jmx'], emptyList);
}

function getRowDetails(row) {
  return (
    <Chart
      snapshotId={row.snapshotId}
      timeConfig={row.timeConfig}
      y1={{
        formatter: withSiPrefixThreeDecimalPlaces,
        metrics: ['jmx.' + row.name],
        labels: [row.name],
        type: 'line'
      }}
      renderPostChartContent={PluginDashboardsMarkerLanes}
    />
  );
}
