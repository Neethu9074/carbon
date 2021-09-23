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
    title: t('in-zhmc:dashboards.adapterName'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.adapter.get('adapterName');
      }
    }
  },
  {
    title: t('in-zhmc:dashboards.adapterUsage'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.adapter.get('adapterUsage');
      }
    }
  }
];

export default connectTo(
  ({ snapshotId }) => {
    return {
      data: getRawPayload(snapshotId, 'adapters')
    };
  },
  function AdapterUsageTable({ data }) {
    if (!data) {
      return null;
    }
    const adapters = data.toArray();

    if (adapters.size === 0) {
      return null;
    }
    const rows = adapters.map((adapter, idx) => {
      return {
        key: String(idx),
        adapter
      };
    });

    return (
      <Table
        withoutPadding
        cardTitle={t('in-zhmc:dashboards.adapterUsage')}
        cols={cols}
        rows={rows}
        initialSortColumn={0}
        initialSortDirection="asc"
      />
    );
  }
);
