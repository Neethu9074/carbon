/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import TimeOfLastUpdateCardTitle from 'in-sdk/components/dashboard/TimeOfLastUpdateCardTitle';
import { seconds, positiveNumber } from 'in-services/formatters/number';
import { getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import Table from 'in-sdk/components/dashboard/Table';
import { formatSql } from 'in-forge/tracing/jdbc/sql';
import { shorten } from 'in-services/util/string';
import connectTo from 'in-hoc/connectTo';
import Code from 'in-components/Code';
import { t } from 'in-i18n';

import locals from './RawTableFormat.mless';

const cols = [
  {
    title: t('in-forge:plugins.db2Database.applicationHandle'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.topQuery.get('APPLICATION_HANDLE');
      },
      getContent: positiveNumber
    }
  },
  {
    title: t('in-forge:plugins.db2Database.applicationName'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.topQuery.get('APPLICATION_NAME');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-forge:plugins.db2Database.sessionAuthId'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.topQuery.get('SESSION_AUTH_ID');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-forge:plugins.db2Database.elapsedTimeSec'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.topQuery.get('ELAPSED_TIME_SEC');
      },
      getContent: seconds.detailed
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
            title={t('in-forge:plugins.db2Database.dashboard.topQueries')}
            timestamp={data.get('timestamp')}
          />
        }
        cols={cols}
        rows={rows}
        initialSortColumn={3}
        initialSortDirection="desc"
        getRowDetails={getDetails}
      />
    );
  }
);

function getDetails(row) {
  return <Code code={formatSql(row.topQuery.get('STMT_TEXT'))} lang="sql" />;
}

function Args({ args }) {
  return <code className={locals.statement}>{args}</code>;
}
