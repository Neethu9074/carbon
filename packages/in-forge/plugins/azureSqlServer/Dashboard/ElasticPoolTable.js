/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { bytesTwoDecimalPlaces } from 'in-services/formatters/number';
import { emptyMap } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.azureSqlServer.dashboard.titleName'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.pool.get('name');
      }
    }
  },
  {
    title: t('in-forge:plugins.azureSqlServer.dashboard.titleLocation'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.pool.get('location');
      }
    }
  },
  {
    title: t('in-forge:plugins.azureSqlServer.dashboard.titleState'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.pool.get('state');
      }
    }
  },
  {
    title: t('in-forge:plugins.azureSqlServer.dashboard.titleSKU'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.pool.get('sku');
      }
    }
  },
  {
    title: t('in-forge:plugins.azureSqlServer.dashboard.titleMaxSize'),
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

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.azureSqlServer.dashboard.titleElasticPoolCount', {
        elasticPoolCount: rows.length
      })}
      cols={cols}
      rows={rows}
    />
  );
}
