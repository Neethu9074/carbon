/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import TimeOfLastUpdateCardTitle from 'in-sdk/components/dashboard/TimeOfLastUpdateCardTitle';
import { getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import { number, millis } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { formatSql } from 'in-forge/tracing/jdbc/sql';
import { shorten } from 'in-services/util/string';
import connectTo from 'in-hoc/connectTo';
import Code from 'in-components/Code';
import { t } from 'in-i18n';

import locals from './TopQueriesTable.mless';

const cols = [
  {
    title: t('in-forge:plugins.msSqlDatabase.totalTime'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.topQuery.get('tet');
      },
      getContent: millis.compact
    }
  },
  {
    title: t('in-forge:plugins.msSqlDatabase.lastTime'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.topQuery.get('let');
      },
      getContent: millis.compact
    }
  },
  {
    title: t('in-forge:plugins.msSqlDatabase.query'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.topQuery.get('qt');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-forge:plugins.msSqlDatabase.reads'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.topQuery.get('llr');
      },
      getContent: number.compact
    }
  },
  {
    title: t('in-forge:plugins.msSqlDatabase.writes'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.topQuery.get('llw');
      },
      getContent: number.compact
    }
  }
];

export default connectTo(
  props => {
    return {
      data: getRawPayloadWithTimestamp(props.snapshotId, 'topqueries')
    };
  },
  function TopQueriesTable({ data }) {
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
            title={t('in-forge:plugins.msSqlDatabase.topQueries')}
            timestamp={data.get('timestamp')}
          />
        }
        cols={cols}
        rows={rows}
        initialSortColumn={1}
        initialSortDirection="desc"
        getRowDetails={getDetails}
      />
    );
  }
);

function getDetails(row) {
  return <Code code={formatSql(row.topQuery.get('qt'))} lang="sql" />;
}

function Args({ args }) {
  return <code className={locals.statement}>{args}</code>;
}
