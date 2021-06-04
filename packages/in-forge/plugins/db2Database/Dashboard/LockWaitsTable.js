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

import locals from './RawTableFormat.mless';

const cols = [
  {
    title: t('in-forge:plugins.db2Database.reqApplicationHandle'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.topQuery.get('REQ_APPLICATION_HANDLE');
      },
      getContent: number.compact
    }
  },
  {
    title: t('in-forge:plugins.db2Database.hldApplicationHandle'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.topQuery.get('HLD_APPLICATION_HANDLE');
      },
      getContent: number.compact
    }
  },
  {
    title: t('in-forge:plugins.db2Database.lockMode'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.topQuery.get('LOCK_MODE');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-forge:plugins.db2Database.lockModeRequested'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.topQuery.get('LOCK_MODE_REQUESTED');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-forge:plugins.db2Database.lockObjectType'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.topQuery.get('LOCK_OBJECT_TYPE');
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
        return row.topQuery.get('LOCK_WAIT_ELAPSED_TIME');
      },
      getContent: millis.compact
    }
  }
];

export default connectTo(
  props => {
    return {
      data: getRawPayloadWithTimestamp(props.snapshotId, 'lockWaits')
    };
  },
  function LockWaitsTable({ data }) {
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
            title={t('in-forge:plugins.db2Database.dashboard.lockWaits')}
            timestamp={data.get('timestamp')}
          />
        }
        cols={cols}
        rows={rows}
        initialSortColumn={5}
        getRowDetails={getDetails}
        initialSortDirection="desc"
      />
    );
  }
);

function getDetails(row) {
  return <Code code={formatSql(row.topQuery.get('REQ_STMT_TEXT'))} lang="sql" />;
}
function Args({ args }) {
  return <code className={locals.statement}>{args}</code>;
}
