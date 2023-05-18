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

const instCols = [
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

const instIdCol = [
  {
    title: t('in-forge:plugins.oracleDB.instanceID'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.instId;
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

  function T(props) {
    const { data, snapshot } = props;

    if (!data || !data.get('raw_payload') || !snapshot || !snapshot.get('data')) {
      return null;
    }
    const topElapsedTimeQueriesPayload = data.get('raw_payload');
    if (topElapsedTimeQueriesPayload.size === 0) {
      return null;
    }

    const snapshotData = snapshot.get('data');
    const racEnabled = snapshotData.get('enableRacMonitoring');
    var cols = instCols;
    var initialSortColumn = 1;
    if (racEnabled) {
      initialSortColumn = 2;
      cols = instIdCol.concat(cols);
    }

    const rows = topElapsedTimeQueriesPayload.toJS().map(query => {
      return {
        key: query.sqlId,
        sqlText: query.sqlText,
        elapsedTimePerExecution: query.elapsedTimePerExecution,
        instId: query.instId
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
        initialSortDirection="desc"
        initialSortColumn={initialSortColumn}
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
