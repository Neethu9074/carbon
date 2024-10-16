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
import Table from 'in-sdk/components/dashboard/Table';
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
    title: t('in-forge:plugins.snowflake.dashboard.queryText'),
    type: 'string',
    typeArgs: {
      getValue(row: LongestRunningQueryRow) {
        return row.queries.get('query_text');
      }
    }
  },
  {
    title: t('in-forge:plugins.snowflake.dashboard.execTime'),
    type: 'string',
    typeArgs: {
      getValue(row: LongestRunningQueryRow) {
        return row.queries.get('query_exec_time');
      }
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

  if (!data) {
    return null;
  }

  const longestRunningQueries: any = (data as SnapshotData).get('raw_payload');

  const rows: LongestRunningQueryRow = longestRunningQueries.toArray().map((queries: SnapshotData, index: number) => {
    return {
      key: String(index),
      queries
    };
  });
  return (
    <Table
      cardTitle={t('in-forge:plugins.snowflake.dashboard.longestRunningQueries')}
      withoutPadding
      cols={cols}
      rows={rows}
      maxItemsPerPage={5}
      initialSortColumn={2}
      initialSortDirection="desc"
      disableSorting
    />
  );
};

export default LongRunningQueries;
