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

const missingValue = '/';

const cols = [
  {
    title: t('in-forge:plugins.aceIntegrationServer.messageFlowName'),
    type: 'snapshotLink',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      }
    }
  },
  {
    title: t('in-forge:plugins.aceIntegrationServer.status'),
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
    messageFlows: getClusterMembers(props.snapshotId)
      // Always start with an empty set to avoid inconsistent view,
      // displaying running components for a previously selected snapshot.
      .flatMap(messageFlowIds => combineLatest(messageFlowIds.toArray().map(id => getSnapshot(id))))
      .throttle(1000)
  }),

  function MessageFlowTable({ messageFlows, timeConfig }) {
    if (messageFlows == null || messageFlows.length === 0) {
      return null;
    }

    const rows = messageFlows.map(messageFlow => {
      const id = messageFlow.get('id');
      return {
        key: id,
        snapshotId: id,
        snapshot: messageFlow,
        timeConfig
      };
    });

    return (
      <Table
        withoutPadding
        cardTitle={t('in-forge:plugins.aceIntegrationServer.messageFlowNumber', { count: rows.length })}
        cols={cols}
        rows={rows}
      />
    );
  }
);
