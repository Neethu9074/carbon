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
    title: t('in-forge:plugins.msiis.name'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  },
  {
    title: t('in-forge:plugins.msiis.aspNetVersion'),
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

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.msiis.applicationPoolsWithCount', { len: rows.length })}
      cols={cols}
      rows={rows}
    />
  );
}
