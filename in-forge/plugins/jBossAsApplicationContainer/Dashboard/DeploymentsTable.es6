import React from 'react';

import ServletsTable from 'in-forge/plugins/jBossAsApplicationContainer/Dashboard/ServletsInDeploymentsTable';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { zeroDecimalPlaces } from 'in-services/formatters/number';
import Chart from 'in-components/Chart';
import { yesOrNo } from 'in-services/formatters/boolean';
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
    title: 'Context Root',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.deployment.get('contextRoot');
      }
    }
  },
  {
    title: 'Enabled',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return yesOrNo(row.deployment.get('enabled'));
      }
    }
  },
  {
    title: 'Status',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.deployment.get('status');
      }
    }
  },
  {
    title: 'Active Sessions',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'sessions.' + row.key + '.activeSessions';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function DeploymentsTable({ snapshot, timeframe }) {
  const deployments = snapshot.getIn(['data', 'deployments'], emptyMap).filter(c => c.get('contextRoot'));
  if (deployments.size === 0) {
    return null;
  }

  const rows = deployments.keySeq().toArray().map(key => {
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
    <DashboardSection title={`Web Deployments (${rows.length})`}>
      <Table cols={cols} rows={rows} getRowDetails={getRowDetails} />
    </DashboardSection>
  );
}

function getRowDetails(row) {
  return (
    <div>
      <ServletsTable deploymentContext={row.key} snapshot={row.snapshot} timeframe={row.timeframe} />

      <Chart
        snapshotId={row.snapshotId}
        timeframe={row.timeframe}
        margins={{
          left: 80
        }}
        y1={{
          metrics: ['sessions.' + row.key + '.activeSessions'],
          labels: ['Active Sessions'],
          type: 'line',
          min: 0
        }}
      />
    </div>
  );
}
