/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';

const cols = [
  {
    title: 'Name',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  },
  {
    title: 'ASP.NET Version',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'iis.apppools', row.key, 'runtimeversion']);
      }
    }
  }
];

export default function ApplicationPoolsTable({ snapshot }) {
  const allPools = snapshot.getIn(['data', 'allpools'], emptyList).toArray();
  if (allPools.length === 0) {
    return null;
  }

  const rows = allPools.map(key => {
    return {
      key,
      snapshot
    };
  });

  return <Table withoutPadding cardTitle={`Application Pools (${rows.length})`} cols={cols} rows={rows} />;
}
