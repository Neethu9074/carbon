/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { combineLatest } from '@instana/observables';
import React from 'react';

import { getClusterMembers } from 'in-stores/clusterMembers';
import Table from 'in-sdk/components/dashboard/Table';
import { getSnapshot } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.ibmDataPowerCluster.applianceName'),
    type: 'snapshotLink',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmDataPowerCluster.status'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.appliance.getIn(['data', 'status']);
      }
    }
  }
];

export default connectTo(
  props => ({
    appliances: getClusterMembers(props.snapshotId)
      // Always start with an empty set to avoid inconsistent view,
      // displaying running components for a previously selected snapshot.
      .flatMap(applianceIds => combineLatest(applianceIds.toArray().map(id => getSnapshot(id))))
      .throttle(1000)
  }),

  function AppliancesTable({ appliances, timeConfig }) {
    if (appliances == null || appliances.length === 0) {
      return null;
    }

    const rows = appliances.map(appliance => {
      return {
        key: appliance.get('id'),
        appliance,
        timeConfig
      };
    });

    return (
      <Table
        withoutPadding
        cardTitle={t('in-forge:plugins.ibmDataPowerCluster.applianceNumber', { number: rows.length })}
        cols={cols}
        rows={rows}
      />
    );
  }
);
