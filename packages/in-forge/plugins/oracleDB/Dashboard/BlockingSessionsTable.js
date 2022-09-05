/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import Table from 'in-sdk/components/dashboard/Table';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.oracleDB.currentBlockingSessionsStatus'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      },
      getContent(value) {
        return value;
      }
    }
  }
];

export default connectTo(
  props => {
    return {
      data: getRawPayloadWithTimestamp(props.snapshot.get('id'), 'currentBlockingSessions')
    };
  },

  function BlockingSessionsTable({ data }) {
    if (!data || !data.get('raw_payload')) {
      return null;
    }
    const currentBlockingSessionsPayload = data.get('raw_payload');
    if (currentBlockingSessionsPayload.size === 0) {
      return null;
    }

    const rows = currentBlockingSessionsPayload.toJS().map(currentBlockingSession => {
      return {
        key: currentBlockingSession
      };
    });

    return (
      <Table
        withoutPadding
        cardTitle={t('in-forge:plugins.oracleDB.currentBlockingSessions', { len: rows.length })}
        cols={cols}
        rows={rows}
        maxItemsPerPage={5}
      />
    );
  }
);
