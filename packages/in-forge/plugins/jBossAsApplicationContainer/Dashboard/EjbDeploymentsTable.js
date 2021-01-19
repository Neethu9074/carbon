/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import { zeroDecimalPlaces, number } from 'in-services/formatters/number';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { emptyMap } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';

const cols = [
  {
    title: 'Deployment',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  },
  {
    title: 'Pool',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.deployment.get('pool');
      }
    }
  },
  {
    title: 'Pool Size',
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.deployment.get('poolSize');
      },
      getContent: number.compact
    }
  },
  {
    title: 'Pool Available',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'ejbs.' + row.key + '.poolAvailable';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function EjbDeploymentsTable({ snapshot, timeConfig }) {
  const deployments = snapshot.getIn(['data', 'ejbDeployments'], emptyMap);
  if (deployments.size === 0) {
    return null;
  }

  const rows = deployments
    .keySeq()
    .toArray()
    .map(key => {
      const deployment = deployments.get(key);
      return {
        key,
        timeConfig,
        snapshotId: snapshot.get('id'),
        snapshot: snapshot,
        deployment
      };
    });

  return (
    <Table
      cardTitle={`EJB Deployments (${rows.length})`}
      cols={cols}
      rows={rows}
      getRowDetails={getRowDetails}
      withoutPadding
    />
  );
}

function getRowDetails(row) {
  return (
    <div>
      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          metrics: ['ejbs.' + row.key + '.poolAvailable'],
          labels: ['Available'],
          type: 'line',
          min: 0
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
    </div>
  );
}
