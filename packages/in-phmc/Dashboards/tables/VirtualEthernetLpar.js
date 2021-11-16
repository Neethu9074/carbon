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
    title: t('in-phmc:vlanId'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.virtualEthernetAdapter.get('vlanId');
      }
    }
  },
  {
    title: t('in-phmc:adapterId'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.virtualEthernetAdapter.get('sharedEthernetAdapterId');
      }
    }
  },
  {
    title: t('in-phmc:viosId'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.virtualEthernetAdapter.get('viosId');
      }
    }
  },
  {
    title: t('in-phmc:vswitchId'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.virtualEthernetAdapter.get('vswitchId');
      }
    }
  },
  {
    title: t('in-phmc:sentPackets'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.virtualEthernetAdapter.get('sentPackets');
      }
    }
  },
  {
    title: t('in-phmc:recievedPackets'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.virtualEthernetAdapter.get('receivedPackets');
      }
    }
  },
  {
    title: t('in-phmc:droppedPackets'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.virtualEthernetAdapter.get('droppedPackets');
      }
    }
  },
  {
    title: t('in-phmc:sentBytes'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.virtualEthernetAdapter.get('sentBytes');
      }
    }
  },
  {
    title: t('in-phmc:recievedBytes'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.virtualEthernetAdapter.get('receivedBytes');
      }
    }
  },
  {
    title: t('in-phmc:transferredBytes'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.virtualEthernetAdapter.get('transferredBytes');
      }
    }
  },
  {
    title: t('in-phmc:transferredPhysicalBytes'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.virtualEthernetAdapter.get('transferredPhysicalBytes');
      }
    }
  }
];

export default connectTo(
  ({ snapshotId }) => {
    return {
      data: getRawPayload(snapshotId, 'virtualEthernetAdapters')
    };
  },
  function VirtualEthernetLpar({ data }) {
    if (!data) {
      return null;
    }
    const virtualEthernetAdapters = data.toArray();

    if (virtualEthernetAdapters.size === 0) {
      return null;
    }
    const rows = virtualEthernetAdapters.map((virtualEthernetAdapter, idx) => {
      return {
        key: String(idx),
        virtualEthernetAdapter
      };
    });

    return (
      <Table
        withoutPadding
        cardTitle={t('in-phmc:dashboards.virtualEthernetAdapter')}
        cols={cols}
        rows={rows}
        initialSortColumn={0}
        initialSortDirection="asc"
      />
    );
  }
);
