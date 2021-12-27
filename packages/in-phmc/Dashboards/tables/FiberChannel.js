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
        return row.fiberChannelAdapter.get('id');
      }
    }
  },
  {
    title: t('in-phmc:wwpn'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.fiberChannelAdapter.get('wwpn');
      }
    }
  },
  {
    title: t('in-phmc:ports'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.fiberChannelAdapter.get('numOfPorts');
      }
    }
  },
  {
    title: t('in-phmc:physicalLocation'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.fiberChannelAdapter.get('physicalLocation');
      }
    }
  },
  {
    title: t('in-phmc:reads'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.fiberChannelAdapter.get('numOfReads');
      }
    }
  },
  {
    title: t('in-phmc:writes'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.fiberChannelAdapter.get('numOfWrites');
      }
    }
  },
  {
    title: t('in-phmc:readBytes'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.fiberChannelAdapter.get('readBytes');
      }
    }
  },
  {
    title: t('in-phmc:writeBytes'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.fiberChannelAdapter.get('writeBytes');
      }
    }
  },
  {
    title: t('in-phmc:transmittedBytes'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.fiberChannelAdapter.get('transmittedBytes');
      }
    }
  },
  {
    title: t('in-phmc:runningSpeed'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.fiberChannelAdapter.get('runningSpeed');
      }
    }
  }
];

export default connectTo(
  ({ snapshotId }) => {
    return {
      data: getRawPayload(snapshotId, 'fiberChannelAdapters')
    };
  },
  function FiberChannel({ data }) {
    if (!data) {
      return null;
    }
    const fiberChannelAdapters = data.toArray();

    if (fiberChannelAdapters.size === 0) {
      return null;
    }
    const rows = fiberChannelAdapters.map((fiberChannelAdapter, idx) => {
      return {
        key: String(idx),
        fiberChannelAdapter
      };
    });

    return (
      <Table
        withoutPadding
        cardTitle={t('in-phmc:dashboards.fiberChannelAdapter')}
        cols={cols}
        rows={rows}
        initialSortColumn={0}
        initialSortDirection="asc"
      />
    );
  }
);
