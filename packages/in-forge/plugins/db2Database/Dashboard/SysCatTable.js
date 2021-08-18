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
    title: t('in-forge:plugins.db2Database.tabName'),
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
    title: t('in-forge:plugins.db2Database.statsTime'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.topQuery.get('STATS_TIME');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },

  {
    title: t('in-forge:plugins.db2Database.volatile'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.topQuery.get('VOLATILE');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-forge:plugins.db2Database.compression'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.topQuery.get('COMPRESSION');
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
  }
];

export default connectTo(
  props => {
    return {
      data: getRawPayloadWithTimestamp(props.snapshotId, 'syscatTables')
    };
  },
  function SysCatTable({ snapshot, data }) {
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
            title={
              t('in-forge:plugins.db2Database.dashboard.sysCatTables') +
              '- ' +
              snapshot.get('data').get('tabschema') +
              ' Schema'
            }
          />
        }
        cols={cols}
        rows={rows}
        initialSortColumn={1}
        initialSortDirection="asc"
      />
    );
  }
);

function Args({ args }) {
  return <code className={locals.statement}>{args}</code>;
}
