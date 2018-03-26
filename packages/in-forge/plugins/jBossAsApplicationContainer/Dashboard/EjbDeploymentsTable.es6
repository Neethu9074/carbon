import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { zeroDecimalPlaces, number } from 'in-services/formatters/number';
import Chart from 'in-components/Chart';
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

export default function EjbDeploymentsTable({ snapshot, timeframe }) {
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
        timeframe,
        snapshotId: snapshot.get('id'),
        snapshot: snapshot,
        deployment
      };
    });

  return (
    <DashboardSection title={`EJB Deployments (${rows.length})`}>
      <Table cols={cols} rows={rows} getRowDetails={getRowDetails} />
    </DashboardSection>
  );
}

function getRowDetails(row) {
  return (
    <div>
      <Chart
        snapshotId={row.snapshotId}
        timeframe={row.timeframe}
        y1={{
          metrics: ['ejbs.' + row.key + '.poolAvailable'],
          labels: ['Available'],
          type: 'line',
          min: 0
        }}
      />
    </div>
  );
}
