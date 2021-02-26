/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import { bytesTwoDecimalPlaces } from 'in-services/formatters/number';
import { emptyMap } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';

const cols = [
  {
    title: t('in-forge:plugins.azureSqlServer.dashboard.titleName'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.db.get('name');
      }
    }
  },
  {
    title: t('in-forge:plugins.azureSqlServer.dashboard.titleLocation'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.db.get('location');
      }
    }
  },
  {
    title: t('in-forge:plugins.azureSqlServer.dashboard.titleStatus'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.db.get('status');
      }
    }
  },
  {
    title: t('in-forge:plugins.azureSqlServer.dashboard.titleSKU'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.db.get('sku');
      }
    }
  },
  {
    title: t('in-forge:plugins.azureSqlServer.dashboard.titleMaxSize'),
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

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.azureSqlServer.dashboard.titleDatabaseCount', { databaseCount: rows.length })}
      cols={cols}
      rows={rows}
    />
  );
}
