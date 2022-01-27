/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import getWebSphereDeploymentManagersForInfrastructureManager from 'in-forge/plugins/webSphereInfrastructureManager/subscriptions/getWebSphereDeploymentManagersForInfrastructureManager';
import Table from 'in-sdk/components/dashboard/Table';
import { timeConfig$ } from 'in-stores/time/config';
import { getSnapshots } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.webSphereInfrastructureManager.serverName'),
    type: 'snapshotLink',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      }
    }
  }
];

export default connectTo(
  props => ({
    deploymentManagers: timeConfig$
      .flatMap(timeConfig =>
        getWebSphereDeploymentManagersForInfrastructureManager({ snapshotId: props.snapshotId, timeConfig })
      )
      .flatMap(getSnapshots)
  }),

  function DeploymentManagersTable({ deploymentManagers, timeConfig }) {
    if (deploymentManagers == null || deploymentManagers.length === 0) {
      return null;
    }

    const rows = deploymentManagers.map(deploymentManager => {
      return {
        key: deploymentManager.get('id'),
        deploymentManager,
        timeConfig
      };
    });

    return (
      <Table
        withoutPadding
        cardTitle={t('in-forge:plugins.webSphereInfrastructureManager.deploymentManagerNumber', { count: rows.length })}
        cols={cols}
        rows={rows}
      />
    );
  }
);
