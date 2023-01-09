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
    title: t('in-forge:plugins.oracleDB.sumCpuTimeDelta'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.sumCpuTimeDelta / 1000;
      },
      getContent(value) {
        return value;
      }
    }
  },
  {
    title: t('in-forge:plugins.oracleDB.sumDiskReadsDelta'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.sumDiskReadsDelta;
      },
      getContent(value) {
        return value;
      }
    }
  },
  {
    title: t('in-forge:plugins.oracleDB.count'),
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
      data: getRawPayloadWithTimestamp(props.snapshot.get('id'), 'topCPUQueriesLast24hr')
    };
  },

  function T({ data }) {
    if (!data || !data.get('raw_payload')) {
      return null;
    }
    const topCPUQueriesLast24hrPayload = data.get('raw_payload');
    if (topCPUQueriesLast24hrPayload.size === 0) {
      return null;
    }

    const rows = topCPUQueriesLast24hrPayload.toJS().map(query => {
      return {
        key: query.sqlId,
        sqlText: query.sqlText,
        sumCpuTimeDelta: query.sumCPUTimeDelta,
        sumDiskReadsDelta: query.sumDiskReadsDelta,
        count: query.count
      };
    });
    return (
      <Table
        cardTitle={t('in-forge:plugins.oracleDB.topCPUQueriesLast24hr', { len: rows.length })}
        withoutPadding
        cols={cols}
        rows={rows}
        maxItemsPerPage={5}
        initialSortColumn={2}
        initialSortDirection="desc"
        getRowDetails={getDetails}
      />
    );
  }
);

function getDetails(row) {
  return (
    <div>
      <label>{t('in-forge:plugins.oracleDB.sqlText')}</label>
      <p />
      <label>{row.sqlText}</label>
    </div>
  );
}
