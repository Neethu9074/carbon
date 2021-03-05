/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import createDeploymentConfigsForNamespaceSubscription from 'in-subscription/deploymentConfigsForNamespace';
import { number, timeByMillisTwoDecimalPlaces } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { timeConfig$ } from 'in-stores/time/config';
import { getSnapshots } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';

const msFormatter = d => (d < 0 ? t('in-forge:plugins.kubernetesCluster.noActivity') : timeByMillisTwoDecimalPlaces(d));

const cols = [
  {
    title: t('in-forge:plugins.kubernetesNamespace.name'),
    type: 'snapshotLink',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      }
    }
  },
  {
    title: t('in-forge:plugins.kubernetesNamespace.availableReplicas'),
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
    title: t('in-forge:plugins.kubernetesNamespace.desiredReplicas'),
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
    title: t('in-forge:plugins.kubernetesNamespace.lastPendingPhaseDuration'),
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

    return (
      <Table
        withoutPadding
        cardTitle={t('in-forge:plugins.kubernetesNamespace.deploymentConfigsWithCount', { len: rows.length })}
        cols={cols}
        rows={rows}
      />
    );
  }
);
