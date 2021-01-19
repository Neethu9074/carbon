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
        return row.db.get('name');
      }
    }
  },
  {
    title: 'Location',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.db.get('location');
      }
    }
  },
  {
    title: 'Status',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.db.get('status');
      }
    }
  },
  {
    title: 'SKU',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.db.get('sku');
      }
    }
  },
  {
    title: 'Max Size',
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.db.get('maxSizeBytes');
      },
      getContent: bytesTwoDecimalPlaces
    }
  }
];

export default function DatabaseTable({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  const rows = snapshot
    .getIn(['data', 'databases'], emptyMap)
    .map((db, key) => {
      return {
        key,
        db,
        timeConfig,
        snapshotId
      };
    })
    .toArray();

  if (rows.length === 0) {
    return null;
  }

  return <Table withoutPadding cardTitle={`Databases (${rows.length})`} cols={cols} rows={rows} />;
}
