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
        return row.sharedAdapter.get('id');
      }
    }
  },
  {
    title: t('in-phmc:type'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.sharedAdapter.get('type');
      }
    }
  },
  {
    title: t('in-phmc:bridgedAdapters'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.sharedAdapter.get('bridgedAdapter');
      }
    }
  },
  {
    title: t('in-phmc:sentPackets'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.sharedAdapter.get('sentPackets');
      }
    }
  },
  {
    title: t('in-phmc:recievedPackets'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.sharedAdapter.get('receivedPackets');
      }
    }
  },
  {
    title: t('in-phmc:droppedPackets'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.sharedAdapter.get('droppedPackets');
      }
    }
  },
  {
    title: t('in-phmc:sentBytes'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.sharedAdapter.get('sentBytes');
      }
    }
  },
  {
    title: t('in-phmc:recievedBytes'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.sharedAdapter.get('receivedBytes');
      }
    }
  },
  {
    title: t('in-phmc:transferredBytes'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.sharedAdapter.get('transferredBytes');
      }
    }
  }
];

export default connectTo(
  ({ snapshotId }) => {
    return {
      data: getRawPayload(snapshotId, 'sharedAdapters')
    };
  },
  function SharedAdapter({ data }) {
    if (!data) {
      return null;
    }
    const sharedAdapters = data.toArray();

    if (sharedAdapters.size === 0) {
      return null;
    }
    const rows = sharedAdapters.map((sharedAdapter, idx) => {
      return {
        key: String(idx),
        sharedAdapter
      };
    });

    return (
      <Table
        withoutPadding
        cardTitle={t('in-phmc:dashboards.sharedAdapter')}
        cols={cols}
        rows={rows}
        initialSortColumn={0}
        initialSortDirection="asc"
      />
    );
  }
);
