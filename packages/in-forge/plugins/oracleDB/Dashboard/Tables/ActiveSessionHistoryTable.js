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
    title: t('in-forge:plugins.oracleDB.sqlId'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      },
      getContent(value) {
        return value;
      }
    }
  },
  {
    title: t('in-forge:plugins.oracleDB.loadPerecntage'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.loadPercentage;
      },
      getContent(value) {
        return value;
      }
    }
  },
  {
    title: t('in-forge:plugins.oracleDB.sessionCount'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.count;
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
      data: getRawPayloadWithTimestamp(props.snapshot.get('id'), 'activeSessionHistory')
    };
  },

  function T({ data }) {
    if (!data || !data.get('raw_payload')) {
      return null;
    }
    const activeSessionHistoryPayload = data.get('raw_payload');
    if (activeSessionHistoryPayload.size === 0) {
      return null;
    }

    const rows = activeSessionHistoryPayload.toJS().map(activeSession => {
      return {
        key: activeSession.sqlId,
        count: activeSession.count,
        loadPercentage: activeSession.loadPercentage
      };
    });
    return (
      <Table
        cardTitle={t('in-forge:plugins.oracleDB.activeSessionHistory', { len: rows.length })}
        withoutPadding
        cols={cols}
        rows={rows}
        maxItemsPerPage={5}
        initialSortColumn={1}
        initialSortDirection="desc"
      />
    );
  }
);
