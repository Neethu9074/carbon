/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.cassandraCluster.dashboard.titleHostID'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  }
];

export default function ClusterDownNodesTable({ snapshot }) {
  const unreachable = (snapshot.getIn(['data', 'unreachableNodes']) || emptyList).toArray();
  const rows = unreachable.map(id => {
    return {
      key: id
    };
  });

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.cassandraCluster.dashboard.titleUnreachableNodesCount', {
        nodeCount: rows.length
      })}
      cols={cols}
      rows={rows}
    />
  );
}
