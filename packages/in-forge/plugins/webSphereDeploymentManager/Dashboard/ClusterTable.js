/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import getWebSphereClustersForDeploymentManager from 'in-forge/plugins/webSphereDeploymentManager/subscriptions/getWebSphereClustersForDeploymentManager';
import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { timeConfig$ } from 'in-stores/time/config';
import { getSnapshots } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.webSphereDeploymentManager.dashboard.clusterName'),
    type: 'snapshotLink',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      }
    }
  },
  {
    title: t('in-forge:plugins.webSphereDeploymentManager.dashboard.status'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.cluster.getIn(['data', 'status']);
      }
    }
  },
  {
    title: t('in-forge:plugins.webSphereDeploymentManager.dashboard.memberCount'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      },
      getMetricName() {
        return 'memberCount';
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default connectTo(
  props => ({
    clusters: timeConfig$
      .flatMap(timeConfig => getWebSphereClustersForDeploymentManager({ snapshotId: props.snapshotId, timeConfig }))
      .flatMap(getSnapshots)
  }),

  function ClusterTable({ clusters, timeConfig }) {
    if (clusters == null || clusters.length === 0) {
      return null;
    }

    const rows = clusters.map(cluster => {
      return {
        key: cluster.get('id'),
        cluster,
        timeConfig
      };
    });

    return (
      <Table
        withoutPadding
        cardTitle={t('in-forge:plugins.webSphereDeploymentManager.clustersWithCount', { len: rows.length })}
        cols={cols}
        rows={rows}
      />
    );
  }
);
