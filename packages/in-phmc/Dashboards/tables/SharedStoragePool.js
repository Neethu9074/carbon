/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import Table from 'in-sdk/components/dashboard/Table';
import { getRawPayload } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-phmc:id'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.sharedStoragePool.get('id');
      }
    }
  },
  {
    title: t('in-phmc:reads'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.sharedStoragePool.get('numOfReads');
      }
    }
  },
  {
    title: t('in-phmc:writes'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.sharedStoragePool.get('numOfWrites');
      }
    }
  },
  {
    title: t('in-phmc:readBytes'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.sharedStoragePool.get('readBytes');
      }
    }
  },
  {
    title: t('in-phmc:writeBytes'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.sharedStoragePool.get('writeBytes');
      }
    }
  },
  {
    title: t('in-phmc:transmittedBytes'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.sharedStoragePool.get('transmittedBytes');
      }
    }
  },
  {
    title: t('in-phmc:totalSpace'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.sharedStoragePool.get('totalSpace');
      }
    }
  },
  {
    title: t('in-phmc:usedSpace'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.sharedStoragePool.get('usedSpace');
      }
    }
  }
];

export default connectTo(
  ({ snapshotId }) => {
    return {
      data: getRawPayload(snapshotId, 'sharedStoragePools')
    };
  },
  function SharedStoragePool({ data }) {
    if (!data) {
      return null;
    }
    const sharedStoragePools = data.toArray();

    if (sharedStoragePools.size === 0) {
      return null;
    }
    const rows = sharedStoragePools.map((sharedStoragePool, idx) => {
      return {
        key: String(idx),
        sharedStoragePool
      };
    });

    return (
      <Table
        withoutPadding
        cardTitle={t('in-phmc:dashboards.sharedStoragePool')}
        cols={cols}
        rows={rows}
        initialSortColumn={0}
        initialSortDirection="asc"
      />
    );
  }
);
