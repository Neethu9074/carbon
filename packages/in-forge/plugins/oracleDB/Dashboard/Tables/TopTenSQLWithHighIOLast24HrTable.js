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

export default connectTo(
  props => {
    return {
      data: getRawPayloadWithTimestamp(props.snapshot.get('id'), 'topTenSQLWithHighIO24hr')
    };
  },

  function T({ data }) {
    if (!data || !data.get('raw_payload')) {
      return null;
    }
    const TopTenSQLWithHighIOLast24HrPayload = data.get('raw_payload');
    if (TopTenSQLWithHighIOLast24HrPayload.size === 0) {
      return null;
    }

    const rows = TopTenSQLWithHighIOLast24HrPayload.toJS().map(sql => {
      return {
        key: sql.sqlId,
        sec: sql.sec
      };
    });
    return (
      <Table
        cardTitle={t('in-forge:plugins.oracleDB.topTenSQLWithHighIO24hr', { len: rows.length })}
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
