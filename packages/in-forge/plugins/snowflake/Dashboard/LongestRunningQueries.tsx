/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { useObservable } from '@instana/hooks';
import { TimeConfig } from '@instana/types';

// @ts-expect-error needs TS migration
import { SnapshotData, getRawPayloadWithTimestamp } from 'in-stores/snapshot';
// @ts-expect-error
import { formatSql } from 'in-forge/tracing/jdbc/sql';
import { millis } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import Code from 'in-components/Code';
import { t } from 'in-i18n';

interface LongestRunningQueryRow {
  key: string;
  snapshotId: string;
  queries: SnapshotData;
}

interface LongestRunningQueryProps {
  snapshotId: string;
  timeConfig: TimeConfig;
}

const cols = [
  {
    title: t('in-forge:plugins.snowflake.dashboard.queryId'),
    type: 'string',
    typeArgs: {
      getValue(row: LongestRunningQueryRow) {
        return row.queries.get('query_id');
      }
    }
  },
  {
    title: t('in-forge:plugins.snowflake.dashboard.execTime'),
    type: 'number',
    typeArgs: {
      getValue(row: LongestRunningQueryRow) {
        return row.queries.get('query_exec_time');
      },
      getContent: millis.detailed
    }
  },
  {
    title: t('in-forge:plugins.snowflake.dashboard.warehouseUsed'),
    type: 'string',
    typeArgs: {
      getValue(row: LongestRunningQueryRow) {
        return row.queries.get('query_warehouse_used');
      }
    }
  }
];

const LongRunningQueries = function LongRunningQueries({ snapshotId, timeConfig }: LongestRunningQueryProps) {
  const data = useObservable(
    () => getRawPayloadWithTimestamp(snapshotId, 'query.longest_running_queries', timeConfig),
    [snapshotId, timeConfig]
  );

  if (!data || null == (data as SnapshotData).get('raw_payload')) {
    return null;
  }

  const longestRunningQueries: any = (data as SnapshotData).get('raw_payload');

  const rows: LongestRunningQueryRow[] = longestRunningQueries.toArray().map((queries: SnapshotData, index: number) => {
    return {
      key: String(index),
      queries
    };
  });

  if (rows.length === 0) {
    return null;
  }

  function getQueryDetails(row: LongestRunningQueryRow) {
    const queryText: string =
      row.queries.get('query_text') !== null && row.queries.get('query_text') !== undefined
        ? row.queries.get('query_text')
        : '-';
    return (
      <div>
        <p>
          <label>
            <strong>{t('in-forge:plugins.snowflake.dashboard.queryText')}</strong>
            {' : '}
          </label>
          <Code code={formatSql(queryText)} lang="sql" softWrap />
        </p>
      </div>
    );
  }

  return (
    <Table
      cardTitle={t('in-forge:plugins.snowflake.dashboard.longestRunningQueries')}
      withoutPadding
      cols={cols}
      rows={rows}
      maxItemsPerPage={5}
      initialSortColumn={1}
      initialSortDirection="desc"
      getRowDetails={getQueryDetails}
    />
  );
};

export default LongRunningQueries;
