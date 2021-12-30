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
    title: t('in-phmc:drc'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.sriovAdapter.get('drcIndex');
      }
    }
  },
  {
    title: t('in-phmc:physicalPortId'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.sriovAdapter.get('id');
      }
    }
  },
  {
    title: t('in-phmc:physicalLocation'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.sriovAdapter.get('physicalLocation');
      }
    }
  },
  {
    title: t('in-phmc:sentPackets'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.sriovAdapter.get('sentPackets');
      }
    }
  },
  {
    title: t('in-phmc:recievedPackets'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.sriovAdapter.get('receivedPackets');
      }
    }
  },
  {
    title: t('in-phmc:sentBytes'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.sriovAdapter.get('sentBytes');
      }
    }
  },
  {
    title: t('in-phmc:recievedBytes'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.sriovAdapter.get('receivedBytes');
      }
    }
  },
  {
    title: t('in-phmc:transferredBytes'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.sriovAdapter.get('transferredBytes');
      }
    }
  },
  {
    title: t('in-phmc:errorIn'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.sriovAdapter.get('errorIn');
      }
    }
  },
  {
    title: t('in-phmc:errorOut'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.sriovAdapter.get('errorOut');
      }
    }
  }
];

export default connectTo(
  ({ snapshotId }) => {
    return {
      data: getRawPayload(snapshotId, 'sriovAdapters')
    };
  },
  function SriovAdapter({ data }) {
    if (!data) {
      return null;
    }
    const sriovAdapters = data.toArray();

    if (sriovAdapters.size === 0) {
      return null;
    }
    const rows = sriovAdapters.map((sriovAdapter, idx) => {
      return {
        key: String(idx),
        sriovAdapter
      };
    });

    return (
      <Table
        withoutPadding
        cardTitle={t('in-phmc:dashboards.sriovAdapter')}
        cols={cols}
        rows={rows}
        initialSortColumn={0}
        initialSortDirection="asc"
      />
    );
  }
);
