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
        return row.genericAdapter.get('id');
      }
    }
  },
  {
    title: t('in-phmc:type'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.genericAdapter.get('type');
      }
    }
  },
  {
    title: t('in-phmc:sentPackets'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.genericAdapter.get('sentPackets');
      }
    }
  },
  {
    title: t('in-phmc:recievedPackets'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.genericAdapter.get('receivedPackets');
      }
    }
  },
  {
    title: t('in-phmc:droppedPackets'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.genericAdapter.get('droppedPackets');
      }
    }
  },
  {
    title: t('in-phmc:sentBytes'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.genericAdapter.get('sentBytes');
      }
    }
  },
  {
    title: t('in-phmc:recievedBytes'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.genericAdapter.get('receivedBytes');
      }
    }
  },
  {
    title: t('in-phmc:transferredBytes'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.genericAdapter.get('transferredBytes');
      }
    }
  }
];

export default connectTo(
  ({ snapshotId }) => {
    return {
      data: getRawPayload(snapshotId, 'genericAdapters')
    };
  },
  function GenericAdapter({ data }) {
    if (!data) {
      return null;
    }
    const genericAdapters = data.toArray();

    if (genericAdapters.size === 0) {
      return null;
    }
    const rows = genericAdapters.map((genericAdapter, idx) => {
      return {
        key: String(idx),
        genericAdapter
      };
    });

    return (
      <Table
        withoutPadding
        cardTitle={t('in-phmc:dashboards.genericAdapter')}
        cols={cols}
        rows={rows}
        initialSortColumn={0}
        initialSortDirection="asc"
      />
    );
  }
);
