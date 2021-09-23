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
    title: t('in-zhmc:dashboards.channelId'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.flash.get('channelId');
      }
    }
  },
  {
    title: t('in-zhmc:dashboards.adapterUsage'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.flash.get('adapterUsage');
      }
    }
  }
];

export default connectTo(
  ({ snapshotId }) => {
    return {
      data: getRawPayload(snapshotId, 'flashes')
    };
  },
  function FlashMemoryUsageTables({ data }) {
    if (!data) {
      return null;
    }
    const flashes = data.toArray();

    if (flashes.size === 0) {
      return null;
    }
    const rows = flashes.map((flash, idx) => {
      return {
        key: String(idx),
        flash
      };
    });

    return (
      <Table
        withoutPadding
        cardTitle={t('in-zhmc:dashboards.flashMemory')}
        cols={cols}
        rows={rows}
        initialSortColumn={0}
        initialSortDirection="asc"
      />
    );
  }
);
