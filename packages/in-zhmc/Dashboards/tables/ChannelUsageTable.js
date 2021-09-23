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
    title: t('in-zhmc:dashboards.channelName'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.channel.get('channelName');
      }
    }
  },
  {
    title: t('in-zhmc:dashboards.lpar'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.channel.get('logicalPartitionName');
      }
    }
  },
  {
    title: t('in-zhmc:dashboards.channelUsage'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.channel.get('channelUsage');
      }
    }
  }
];

export default connectTo(
  ({ snapshotId }) => {
    return {
      data: getRawPayload(snapshotId, 'channels')
    };
  },
  function ChannelUsageTables({ data }) {
    if (!data) {
      return null;
    }
    const channels = data.toArray();

    if (channels.size === 0) {
      return null;
    }
    const rows = channels.map((channel, idx) => {
      return {
        key: String(idx),
        channel
      };
    });

    return (
      <Table
        withoutPadding
        cardTitle={t('in-zhmc:dashboards.channelUsage')}
        cols={cols}
        rows={rows}
        initialSortColumn={0}
        initialSortDirection="asc"
      />
    );
  }
);
