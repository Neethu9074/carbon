/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import { megaBytes } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.oracleDB.pool'),
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
    title: t('in-forge:plugins.oracleDB.usedMemory'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.used;
      },
      getContent: megaBytes.compact
    }
  },
  {
    title: t('in-forge:plugins.oracleDB.totalMemory'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.total;
      },
      getContent: megaBytes.compact
    }
  }
];

export default connectTo(
  props => {
    return {
      data: getRawPayloadWithTimestamp(props.snapshot.get('id'), 'differentPoolsInSGA')
    };
  },

  function SGAPoolSizeTable({ data }) {
    if (!data || !data.get('raw_payload')) {
      return null;
    }
    const differentPoolsInSGAPayload = data.get('raw_payload');
    if (differentPoolsInSGAPayload.size === 0) {
      return null;
    }

    const rows = differentPoolsInSGAPayload.toJS().map(sgaPool => {
      return {
        key: sgaPool.name,
        used: sgaPool.used,
        total: sgaPool.totalSize
      };
    });
    return (
      <Table
        cardTitle={t('in-forge:plugins.oracleDB.poolsInSGA', { len: rows.length })}
        withoutPadding
        cols={cols}
        rows={rows}
        maxItemsPerPage={5}
      />
    );
  }
);
