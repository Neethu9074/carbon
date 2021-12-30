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
        return row.genericPhysicalAdapter.get('id');
      }
    }
  },
  {
    title: t('in-phmc:type'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.genericPhysicalAdapter.get('type');
      }
    }
  },
  {
    title: t('in-phmc:physicalLocation'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.genericPhysicalAdapter.get('physicalLocation');
      }
    }
  },
  {
    title: t('in-phmc:reads'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.genericPhysicalAdapter.get('numOfReads');
      }
    }
  },
  {
    title: t('in-phmc:writes'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.genericPhysicalAdapter.get('numOfWrites');
      }
    }
  },
  {
    title: t('in-phmc:readBytes'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.genericPhysicalAdapter.get('readBytes');
      }
    }
  },
  {
    title: t('in-phmc:writeBytes'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.genericPhysicalAdapter.get('writeBytes');
      }
    }
  },
  {
    title: t('in-phmc:transmittedBytes'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.genericPhysicalAdapter.get('transmittedBytes');
      }
    }
  }
];

export default connectTo(
  ({ snapshotId }) => {
    return {
      data: getRawPayload(snapshotId, 'genericPhysicalAdapters')
    };
  },
  function GenericPhysicalAdapter({ data }) {
    if (!data) {
      return null;
    }
    const genericPhysicalAdapters = data.toArray();

    if (genericPhysicalAdapters.size === 0) {
      return null;
    }
    const rows = genericPhysicalAdapters.map((genericPhysicalAdapter, idx) => {
      return {
        key: String(idx),
        genericPhysicalAdapter
      };
    });

    return (
      <Table
        withoutPadding
        cardTitle={t('in-phmc:dashboards.genericPhysicalAdapter')}
        cols={cols}
        rows={rows}
        initialSortColumn={0}
        initialSortDirection="asc"
      />
    );
  }
);
