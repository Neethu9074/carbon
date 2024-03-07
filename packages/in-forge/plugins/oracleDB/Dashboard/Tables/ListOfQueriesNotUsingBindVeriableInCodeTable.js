/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import Table from 'in-sdk/components/dashboard/Table';
import { formatSql } from 'in-forge/tracing/jdbc/sql';
import connectTo from 'in-hoc/connectTo';
import Code from 'in-components/Code';
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
    title: t('in-forge:plugins.oracleDB.plsqlProcedure'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.plsqlProcedure;
      },
      getContent(value) {
        return value;
      }
    }
  },
  {
    title: t('in-forge:plugins.oracleDB.userName'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.userName;
      },
      getContent(value) {
        return value;
      }
    }
  },
  {
    title: t('in-forge:plugins.oracleDB.copies'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.copies;
      },
      getContent(value) {
        return value;
      }
    }
  },
  {
    title: t('in-forge:plugins.oracleDB.executions'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.executions;
      },
      getContent(value) {
        return value;
      }
    }
  },
  {
    title: t('in-forge:plugins.oracleDB.sharableMemInMB'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.sharableMemInMB;
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
      data: getRawPayloadWithTimestamp(props.snapshot.get('id'), 'listOfQueriesNotUsingBindVariableInCode')
    };
  },

  function ListOfQueriesNotUsingBindVeriableInCodeTable(props) {
    const { data, snapshot } = props;
    if (!data || !data.get('raw_payload') || !snapshot || !snapshot.get('data')) {
      return null;
    }
    if (!data || !data.get('raw_payload')) {
      return null;
    }
    const queriesNotUsingBindVariableInCodePayload = data.get('raw_payload');
    if (queriesNotUsingBindVariableInCodePayload.size === 0) {
      return null;
    }

    const snapshotData = snapshot.get('data');
    const racEnabled = snapshotData.get('enableRacMonitoring');
    let cols = instCols;
    let initialSortColumn = 5;
    if (racEnabled) {
      cols = instIdCol.concat(cols);
      initialSortColumn = 6;
    }

    const rows = queriesNotUsingBindVariableInCodePayload.toJS().map(query => {
      return {
        key: query.sqlId,
        sqlText: query.sqlText,
        plsqlProcedure: query.plsqlProcedure,
        userName: query.userName,
        copies: query.copies,
        executions: query.executions,
        sharableMemInMB: query.sharableMemInMB,
        instId: query.instId
      };
    });
    return (
      <Table
        cardTitle={t('in-forge:plugins.oracleDB.listOfQueriesNotUsingBindVariableInCode', { len: rows.length })}
        withoutPadding
        cols={cols}
        rows={rows}
        maxItemsPerPage={5}
        initialSortColumn={initialSortColumn}
        initialSortDirection="desc"
        getRowDetails={getDetails}
      />
    );
  }
);

function getDetails(row) {
  if (row.sqlText) {
    return <Code code={formatSql(row.sqlText)} lang="sql" softWrap />;
  }
}
