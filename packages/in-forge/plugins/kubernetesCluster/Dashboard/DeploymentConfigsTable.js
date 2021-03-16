/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import createDeploymentConfigsForClusterSubscription from 'in-subscription/deploymentConfigsForCluster';
import { number, timeByMillisTwoDecimalPlaces } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { timeConfig$ } from 'in-stores/time/config';
import { getSnapshots } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

const msFormatter = d => (d < 0 ? t('in-forge:plugins.kubernetesCluster.noActivity') : timeByMillisTwoDecimalPlaces(d));

const cols = [
  {
    title: t('in-forge:plugins.kubernetesCluster.name'),
    type: 'snapshotLink',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      }
    }
  },
  {
    title: t('in-forge:plugins.kubernetesCluster.namespace'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.namespace;
      }
    }
  },
  {
    title: t('in-forge:plugins.kubernetesCluster.availableReplicas'),
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
    title: t('in-forge:plugins.kubernetesCluster.desiredReplicas'),
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
    title: t('in-forge:plugins.kubernetesCluster.lastPendingPhaseDuration'),
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
        createDeploymentConfigsForClusterSubscription({ snapshotId: props.snapshot.get('id'), timeConfig })
      )
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
      <Table
        withoutPadding
        cardTitle={t('in-forge:plugins.kubernetesCluster.deploymentConfigsWithCount', { len: rows.length })}
        cols={cols}
        rows={rows}
      />
    );
  }
);
