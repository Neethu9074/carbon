/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc.
 */

import React from 'react';

// import { megaBytes } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { getRawPayloadWithTimestamp } from 'in-stores/snapshot';
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
    title: t('in-forge:plugins.oracleDB.elapsedTimePerExecution'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.elapsedTimePerExecution;
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
      data: getRawPayloadWithTimestamp(props.snapshot.get('id'), 'topElapsedTimeQueries')
    };
  },

  function T({ data }) {
    if (!data || !data.get('raw_payload')) {
      return null;
    }
    const topElapsedTimeQueriesPayload = data.get('raw_payload');
    if (topElapsedTimeQueriesPayload.size === 0) {
      return null;
    }

    const rows = topElapsedTimeQueriesPayload.toJS().map(query => {
      return {
        key: query.sqlId,
        sqlText: query.sqlText,
        elapsedTimePerExecution: query.elapsedTimePerExecution
      };
    });
    return (
      <Table
        cardTitle={t('in-forge:plugins.oracleDB.topElapsedTimeQueries', { len: rows.length })}
        withoutPadding
        cols={cols}
        rows={rows}
        maxItemsPerPage={5}
        getRowDetails={getDetails}
        initialSortColumn={1}
        initialSortDirection="desc"
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
