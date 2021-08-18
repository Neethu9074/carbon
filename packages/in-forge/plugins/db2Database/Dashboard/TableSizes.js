/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import TimeOfLastUpdateCardTitle from 'in-sdk/components/dashboard/TimeOfLastUpdateCardTitle';
import { getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { shorten } from 'in-services/util/string';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

import locals from './RawTableFormat.mless';

const cols = [
  {
    title: t('in-forge:plugins.db2Database.tableName'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.topQuery.get('TABNAME');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-forge:plugins.db2Database.card'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.topQuery.get('CARD');
      },
      getContent: number.compact
    }
  },
  {
    title: t('in-forge:plugins.db2Database.tabSizeKB'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.topQuery.get('TABSIZE_KB');
      },
      getContent: number.compact
    }
  },
  {
    title: t('in-forge:plugins.db2Database.tabSizeMB'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.topQuery.get('TABSIZE_MB');
      },
      getContent: number.compact
    }
  },
  {
    title: t('in-forge:plugins.db2Database.avgRowSize'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.topQuery.get('AVG_ROW_SIZE');
      },
      getContent: number.compact
    }
  }
];

export default connectTo(
  props => {
    return {
      data: getRawPayloadWithTimestamp(props.snapshotId, 'tablesizes')
    };
  },
  function DbConfigTable({ data }) {
    if (!data || !data.get('raw_payload')) {
      return null;
    }

    const topQueries = data.get('raw_payload');
    if (topQueries.size === 0) {
      return null;
    }

    const rows = topQueries.toArray().map((topQuery, idx) => {
      return {
        key: String(idx),
        topQuery
      };
    });

    return (
      <Table
        withoutPadding
        cardTitle={
          <TimeOfLastUpdateCardTitle
            title={t('in-forge:plugins.db2Database.dashboard.tablesizes')}
            timestamp={data.get('timestamp')}
          />
        }
        cols={cols}
        rows={rows}
        initialSortColumn={0}
        initialSortDirection="asc"
      />
    );
  }
);

function Args({ args }) {
  return <code className={locals.statement}>{args}</code>;
}
