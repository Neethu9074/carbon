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
        return row.genericVirtualAdapter.get('id');
      }
    }
  },
  {
    title: t('in-phmc:type'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.genericVirtualAdapter.get('type');
      }
    }
  },
  {
    title: t('in-phmc:physicalLocation'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.genericVirtualAdapter.get('physicalLocation');
      }
    }
  },
  {
    title: t('in-phmc:reads'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.genericVirtualAdapter.get('numOfReads');
      }
    }
  },
  {
    title: t('in-phmc:writes'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.genericVirtualAdapter.get('numOfWrites');
      }
    }
  },
  {
    title: t('in-phmc:readBytes'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.genericVirtualAdapter.get('readBytes');
      }
    }
  },
  {
    title: t('in-phmc:writeBytes'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.genericVirtualAdapter.get('writeBytes');
      }
    }
  },
  {
    title: t('in-phmc:transmittedBytes'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.genericVirtualAdapter.get('transmittedBytes');
      }
    }
  }
];

export default connectTo(
  ({ snapshotId }) => {
    return {
      data: getRawPayload(snapshotId, 'genericVirtualAdapters')
    };
  },
  function GenericVirtualAdapter({ data }) {
    if (!data) {
      return null;
    }
    const genericVirtualAdapters = data.toArray();

    if (genericVirtualAdapters.size === 0) {
      return null;
    }
    const rows = genericVirtualAdapters.map((genericVirtualAdapter, idx) => {
      return {
        key: String(idx),
        genericVirtualAdapter
      };
    });

    return (
      <Table
        withoutPadding
        cardTitle={t('in-phmc:dashboards.genericVirtualAdapter')}
        cols={cols}
        rows={rows}
        initialSortColumn={0}
        initialSortDirection="asc"
      />
    );
  }
);
