/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { combineLatest } from '@instana/observables';

import { getClusterMembers } from 'in-sdk/clusterMembers';
import Table from 'in-sdk/components/dashboard/Table';
import { getSnapshot } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

const missingValue = '/';

const cols = [
  {
    title: t('in-forge:plugins.aceIntegrationNode.serverName'),
    type: 'snapshotLink',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      }
    }
  },
  {
    title: t('in-forge:plugins.aceIntegrationNode.status'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'state'], missingValue);
      }
    }
  }
];

export default connectTo(
  props => ({
    servers: getClusterMembers(props.snapshotId)
      // Always start with an empty set to avoid inconsistent view,
      // displaying running components for a previously selected snapshot.
      .flatMap(serverIds => combineLatest(serverIds.toArray().map(id => getSnapshot(id))))
      .throttle(1000)
  }),

  function IntegrationServerTable({ servers, timeConfig }) {
    if (servers == null || servers.length === 0) {
      return null;
    }

    const rows = servers.map(server => {
      const id = server.get('id');
      return {
        key: id,
        snapshotId: id,
        snapshot: server,
        timeConfig
      };
    });

    return (
      <Table
        withoutPadding
        cardTitle={t('in-forge:plugins.aceIntegrationNode.integrationServerNumber', { count: rows.length })}
        cols={cols}
        rows={rows}
      />
    );
  }
);
