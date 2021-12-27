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
    title: t('in-phmc:wwpn'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.virtualFiberChannelAdapter.get('wwpn');
      }
    }
  },
  {
    title: t('in-phmc:wwpn2'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.virtualFiberChannelAdapter.get('wwpn2');
      }
    }
  },
  {
    title: t('in-phmc:physicalPortWWPN'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.virtualFiberChannelAdapter.get('physicalPortWWPN');
      }
    }
  },
  {
    title: t('in-phmc:viosId'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.virtualFiberChannelAdapter.get('viosId');
      }
    }
  },
  {
    title: t('in-phmc:physicalLocation'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.virtualFiberChannelAdapter.get('physicalLocation');
      }
    }
  },
  {
    title: t('in-phmc:reads'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.virtualFiberChannelAdapter.get('numOfReads');
      }
    }
  },
  {
    title: t('in-phmc:writes'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.virtualFiberChannelAdapter.get('numOfWrites');
      }
    }
  },
  {
    title: t('in-phmc:readBytes'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.virtualFiberChannelAdapter.get('readBytes');
      }
    }
  },
  {
    title: t('in-phmc:writeBytes'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.virtualFiberChannelAdapter.get('writeBytes');
      }
    }
  },
  {
    title: t('in-phmc:transmittedBytes'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.virtualFiberChannelAdapter.get('transmittedBytes');
      }
    }
  },
  {
    title: t('in-phmc:runningSpeed'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.virtualFiberChannelAdapter.get('runningSpeed');
      }
    }
  }
];

export default connectTo(
  ({ snapshotId }) => {
    return {
      data: getRawPayload(snapshotId, 'virtualFiberChannelAdapters')
    };
  },
  function VirtualFiberChannelLpar({ data }) {
    if (!data) {
      return null;
    }
    const virtualFiberChannelAdapters = data.toArray();

    if (virtualFiberChannelAdapters.size === 0) {
      return null;
    }
    const rows = virtualFiberChannelAdapters.map((virtualFiberChannelAdapter, idx) => {
      return {
        key: String(idx),
        virtualFiberChannelAdapter
      };
    });

    return (
      <Table
        withoutPadding
        cardTitle={t('in-phmc:dashboards.virtualFiberChannelAdapter')}
        cols={cols}
        rows={rows}
        initialSortColumn={0}
        initialSortDirection="asc"
      />
    );
  }
);
