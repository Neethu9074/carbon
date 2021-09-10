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
    title: t('in-forge:plugins.aceMessageFlow.flowNodeName'),
    type: 'snapshotLink',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      }
    }
  },
  {
    title: t('in-forge:plugins.aceMessageFlow.nodeType'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'type'], missingValue);
      }
    }
  }
];

export default connectTo(
  props => ({
    flowNodes: getClusterMembers(props.snapshotId)
      // Always start with an empty set to avoid inconsistent view,
      // displaying running components for a previously selected snapshot.
      .flatMap(flowNodeIds => combineLatest(flowNodeIds.toArray().map(id => getSnapshot(id))))
      .throttle(1000)
  }),

  function FlowNodeTable({ flowNodes, timeConfig }) {
    if (flowNodes == null || flowNodes.length === 0) {
      return null;
    }

    const rows = flowNodes.map(flowNode => {
      const id = flowNode.get('id');
      return {
        key: id,
        snapshotId: id,
        snapshot: flowNode,
        timeConfig
      };
    });

    return (
      <Table
        withoutPadding
        cardTitle={t('in-forge:plugins.aceMessageFlow.flowNodeNumber', { count: rows.length })}
        cols={cols}
        rows={rows}
      />
    );
  }
);
