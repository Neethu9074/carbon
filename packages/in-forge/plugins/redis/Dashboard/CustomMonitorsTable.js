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
        return row.monitorName;
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
        return 'monitor.' + row.monitorName;
      },
      getContent: withSiPrefixThreeDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function CustomMonitorsTable({ snapshot, timeConfig }) {
  const monitors = snapshot.getIn(['data', 'monitor'], emptyList);
  if (monitors.size === 0) {
    return null;
  }

  const rows = monitors.toArray().map(name => {
    return {
      key: name,
      timeConfig,
      monitorName: name,
      snapshotId: snapshot.get('id')
    };
  });

  return (
    <Table
      withoutPadding
      cardTitle={`Custom Monitors (${monitors.size})`}
      cols={cols}
      rows={rows}
      getRowDetails={getRowDetails}
    />
  );
}

function getRowDetails(row) {
  return (
    <Chart
      snapshotId={row.snapshotId}
      timeConfig={row.timeConfig}
      y1={{
        formatter: withSiPrefixThreeDecimalPlaces,
        metrics: ['monitor.' + row.monitorName],
        labels: [row.monitorName],
        type: 'line'
      }}
      renderPostChartContent={PluginDashboardsMarkerLanes}
    />
  );
}
