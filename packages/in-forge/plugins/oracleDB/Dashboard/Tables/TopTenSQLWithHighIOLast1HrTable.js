/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc.
 */

import React from 'react';

// import { megaBytes } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { getRawPayloadWithTimestamp } from 'in-stores/snapshot';
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
    title: t('in-forge:plugins.oracleDB.totalWaitTime'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.totalWaitTime / 1000;
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
      data: getRawPayloadWithTimestamp(props.snapshot.get('id'), 'topTenSQLWithHighIO1hr')
    };
  },

  function TopTenSQLWithHighIOLast1HrTable(props) {
    const { data, snapshot } = props;
    if (!data || !data.get('raw_payload') || !snapshot || !snapshot.get('data')) {
      return null;
    }

    if (!data || !data.get('raw_payload')) {
      return null;
    }
    const TopTenSQLWithHighIOLast1HrPayload = data.get('raw_payload');
    if (TopTenSQLWithHighIOLast1HrPayload.size === 0) {
      return null;
    }

    const snapshotData = snapshot.get('data');
    const racEnabled = snapshotData.get('enableRacMonitoring');
    let cols = instCols;
    let initialSortColumn = 2;
    if (racEnabled) {
      cols = instIdCol.concat(cols);
      initialSortColumn = 3;
    }

    const rows = TopTenSQLWithHighIOLast1HrPayload.toJS().map(sql => {
      return {
        key: sql.sqlId,
        sqlText: sql.sqlText,
        totalWaitTime: sql.totalWaitTime,
        userName: sql.userName,
        instId: sql.instId
      };
    });
    return (
      <Table
        cardTitle={t('in-forge:plugins.oracleDB.topTenSQLWithHighIO1hr', { len: rows.length })}
        withoutPadding
        cols={cols}
        rows={rows}
        maxItemsPerPage={5}
        getRowDetails={getDetails}
        initialSortColumn={initialSortColumn}
        initialSortDirection="desc"
      />
    );
  }
);

function getDetails(row) {
  if (row.sqlText) {
    return <Code code={formatSql(row.sqlText)} lang="sql" softWrap />;
  }
}
