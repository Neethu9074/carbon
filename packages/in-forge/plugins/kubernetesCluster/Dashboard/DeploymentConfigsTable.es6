import React from 'react';

import createDeploymentConfigsForClusterSubscription from 'in-subscription/deploymentConfigsForCluster';
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
    title: 'Last Pending Phase Duration',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      },
      getMetricName() {
        return `lastDuration`;
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
    deploymentConfigSnapshots: focusedMoment$
      .flatMap(time => createDeploymentConfigsForClusterSubscription({ snapshotId: props.snapshot.get('id'), time }))
      .flatMap(getSnapshots)
  }),

  function DeploymentConfigsTable({ deploymentConfigSnapshots }) {
    let rows = [];

    if (deploymentConfigSnapshots) {
      rows = deploymentConfigSnapshots.map(deploymentConfigSnapshot => ({
        key: deploymentConfigSnapshot.get('id'),
        name: deploymentConfigSnapshot.getIn(['data', 'name']),
        namespace: deploymentConfigSnapshot.getIn(['data', 'namespace'])
      }));
    }

    return (
      <DashboardSection title={`DeploymentConfigs (${rows.length})`}>
        <Table cols={cols} rows={rows} />
      </DashboardSection>
    );
  }
);
