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

export default connectTo(
  props => {
    return {
      data: getRawPayloadWithTimestamp(props.snapshot.get('id'), 'listOfQueriesNotUsingBindVariableInCode')
    };
  },

  function T({ data }) {
    if (!data || !data.get('raw_payload')) {
      return null;
    }
    const queriesNotUsingBindVariableInCodePayload = data.get('raw_payload');
    if (queriesNotUsingBindVariableInCodePayload.size === 0) {
      return null;
    }

    const rows = queriesNotUsingBindVariableInCodePayload.toJS().map(query => {
      return {
        key: query.sqlId,
        sqlText: query.sqlText,
        plsqlProcedure: query.plsqlProcedure,
        userName: query.userName,
        copies: query.copies,
        executions: query.executions,
        sharableMemInMB: query.sharableMemInMB
      };
    });
    return (
      <Table
        cardTitle={t('in-forge:plugins.oracleDB.listOfQueriesNotUsingBindVariableInCode', { len: rows.length })}
        withoutPadding
        cols={cols}
        rows={rows}
        maxItemsPerPage={5}
        initialSortColumn={5}
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
