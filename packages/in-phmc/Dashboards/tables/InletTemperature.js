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
    title: 'Entity ID',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.sharedProcessorPool.get('id');
      }
    }
  },
  {
    title:'Entity Instance',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.sharedProcessorPool.get('name');
      }
    }
  },
  {
    title:'Temperature Reading',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.sharedProcessorPool.get('assignedProcUnits');
      }
    }
  }
];

export default connectTo(
  ({ snapshotId }) => {
    return {
      data: getRawPayload(snapshotId, 'sharedProcessorPools')
    };
  },
  function SharedProcessorPool({ data }) {
    if (!data) {
      return null;
    }
    const sharedProcessorPools = data.toArray();

    if (sharedProcessorPools.size === 0) {
      return null;
    }
    const rows = sharedProcessorPools.map((sharedProcessorPool, idx) => {
      return {
        key: String(idx),
        sharedProcessorPool
      };
    });

    return (
      <Table
        withoutPadding
        cardTitle={'Inlet Temperature'}
        cols={cols}
        rows={rows}
        initialSortColumn={0}
        initialSortDirection="asc"
      />
    );
  }
);
