/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import Table from 'in-sdk/components/dashboard/Table';
import { emptyMap } from 'in-services/fixedImmutables';
import { bytesTwoDecimalPlaces } from 'in-services/formatters/number';

const cols = [
  {
    title: 'Name',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.pool.get('name');
      }
    }
  },
  {
    title: 'Location',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.pool.get('location');
      }
    }
  },
  {
    title: 'State',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.pool.get('state');
      }
    }
  },
  {
    title: 'SKU',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.pool.get('sku');
      }
    }
  },
  {
    title: 'Max Size',
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.pool.get('maxSizeBytes');
      },
      getContent: bytesTwoDecimalPlaces
    }
  }
];

export default function ElasticPoolTable({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  const rows = snapshot
    .getIn(['data', 'elasticPools'], emptyMap)
    .map((pool, key) => {
      return {
        key,
        pool,
        timeConfig,
        snapshotId
      };
    })
    .toArray();

  if (rows.length === 0) {
    return null;
  }

  return <Table withoutPadding cardTitle={`Elastic Pools (${rows.length})`} cols={cols} rows={rows} />;
}
