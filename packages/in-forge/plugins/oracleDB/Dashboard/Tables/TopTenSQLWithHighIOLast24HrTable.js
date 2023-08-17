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
    title: t('in-forge:plugins.oracleDB.seconds'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.sec;
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
      data: getRawPayloadWithTimestamp(props.snapshot.get('id'), 'topTenSQLWithHighIO24hr')
    };
  },

  function TopTenSQLWithHighIOLast24HrTable(props) {
    const { data, snapshot } = props;
    if (!data || !data.get('raw_payload') || !snapshot || !snapshot.get('data')) {
      return null;
    }
    if (!data || !data.get('raw_payload')) {
      return null;
    }
    const TopTenSQLWithHighIOLast24HrPayload = data.get('raw_payload');
    if (TopTenSQLWithHighIOLast24HrPayload.size === 0) {
      return null;
    }

    const snapshotData = snapshot.get('data');
    const racEnabled = snapshotData.get('enableRacMonitoring');
    let cols = instCols;
    let initialSortColumn = 1;
    if (racEnabled) {
      cols = instIdCol.concat(cols);
      initialSortColumn = 2;
    }

    const rows = TopTenSQLWithHighIOLast24HrPayload.toJS().map(sql => {
      return {
        key: sql.sqlId,
        sec: sql.sec,
        instId: sql.instId
      };
    });
    return (
      <Table
        cardTitle={t('in-forge:plugins.oracleDB.topTenSQLWithHighIO24hr', { len: rows.length })}
        withoutPadding
        cols={cols}
        rows={rows}
        maxItemsPerPage={5}
        initialSortColumn={initialSortColumn}
        initialSortDirection="desc"
      />
    );
  }
);
