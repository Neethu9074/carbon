import React from 'react';

import createDeploymentsForClusterSubscription from 'in-subscription/deploymentsForCluster';
import { number, timeByMillisTwoDecimalPlaces } from 'in-services/formatters/number';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Table from 'in-sdk/components/dashboard/Table';
import { focusedMoment$ } from 'in-stores/timeline';
import { getSnapshots } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';

const msFormatter = d => (d < 0 ? 'No activity' : timeByMillisTwoDecimalPlaces(d));

const cols = [
  {
    title: 'Name',
    type: 'snapshotLink',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      }
    }
  },
  {
    title: 'Namespace',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.namespace;
      }
    }
  },
  {
    title: 'Available Replicas',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      },
      getMetricName() {
        return `availableReplicas`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Desired Replicas',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      },
      getMetricName() {
        return `desiredReplicas`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Last Rollout Duration',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      },
      getMetricName() {
        return `duration`;
      },
      getContent: msFormatter,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default connectTo(
  props => ({
    deploymentSnapshots: focusedMoment$
      .flatMap(time => createDeploymentsForClusterSubscription({ snapshotId: props.snapshot.get('id'), time }))
      .flatMap(getSnapshots)
  }),

  function DeploymentsTable({ deploymentSnapshots }) {
    let rows = [];

    if (deploymentSnapshots) {
      rows = deploymentSnapshots.map(deploymentSnapshot => ({
        key: deploymentSnapshot.get('id'),
        name: deploymentSnapshot.getIn(['data', 'name']),
        namespace: deploymentSnapshot.getIn(['data', 'namespace'])
      }));
    }

    return (
      <DashboardSection title={`Deployments (${rows.length})`}>
        <Table cols={cols} rows={rows} />
      </DashboardSection>
    );
  }
);
