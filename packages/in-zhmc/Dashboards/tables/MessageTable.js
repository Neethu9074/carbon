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
    title: t('in-zhmc:dashboards.messageId'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.message.get('messageId');
      }
    }
  },
  {
    title: t('in-zhmc:dashboards.timestamp'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.message.get('timestamp');
      }
    }
  },
  {
    title: t('in-zhmc:dashboards.messages'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.message.get('message');
      }
    }
  }
];

export default connectTo(
  ({ snapshotId }) => {
    return {
      data: getRawPayload(snapshotId, 'hardwareMessages')
    };
  },
  function MessageTable({ data }) {
    if (!data) {
      return null;
    }
    const messages = data.toArray();

    if (messages.size === 0) {
      return null;
    }
    const rows = messages.map((message, idx) => {
      return {
        key: String(idx),
        message
      };
    });

    return (
      <Table
        withoutPadding
        cardTitle={t('in-zhmc:dashboards.hwMessage')}
        cols={cols}
        rows={rows}
        initialSortColumn={0}
        initialSortDirection="asc"
      />
    );
  }
);
