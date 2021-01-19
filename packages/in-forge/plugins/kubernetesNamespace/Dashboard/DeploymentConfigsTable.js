/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import createDeploymentConfigsForNamespaceSubscription from 'in-subscription/deploymentConfigsForNamespace';
import { number, timeByMillisTwoDecimalPlaces } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { timeConfig$ } from 'in-stores/time/config';
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
    deploymentConfigSnapshots: timeConfig$
      .flatMap(timeConfig =>
        createDeploymentConfigsForNamespaceSubscription({ snapshotId: props.snapshot.get('id'), timeConfig })
      )
      .flatMap(getSnapshots)
  }),

  function DeploymentConfigsTable({ deploymentConfigSnapshots }) {
    let rows = [];

    if (deploymentConfigSnapshots) {
      rows = deploymentConfigSnapshots.map(deploymentConfigSnapshot => ({
        key: deploymentConfigSnapshot.get('id'),
        name: deploymentConfigSnapshot.getIn(['data', 'name'])
      }));
    }

    return <Table withoutPadding cardTitle={`DeploymentConfigs (${rows.length})`} cols={cols} rows={rows} />;
  }
);
