/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { useObservable } from '@instana/hooks';

// @ts-expect-error needs TS migration
import { SnapshotData, getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import Table from 'in-sdk/components/dashboard/Table';
import { shorten } from 'in-services/util/string';
import { t } from 'in-i18n';

import locals from './RawTableFormat.mless';

interface DbConnectRow {
  key: string;
  topQuery: Map<string, object>;
}

const cols = [
  {
    title: t('in-sap:dashboards.taskType'),
    type: 'string',
    typeArgs: {
      getValue(row: DbConnectRow) {
        return row.topQuery.get('TASKTYPE');
      },
      getContent(args: any) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-sap:dashboards.connectionName'),
    type: 'string',
    typeArgs: {
      getValue(row: DbConnectRow) {
        return row.topQuery.get('CONNECTION_NAME');
      },
      getContent(args: any) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-sap:dashboards.entryID'),
    type: 'string',
    typeArgs: {
      getValue(row: DbConnectRow) {
        return row.topQuery.get('ENTRY_ID');
      },
      getContent(args: any) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  }
];

export default function DBConnectionProvider({ snapshotId }: SnapshotData) {
  const data = useObservable(() => getRawPayloadWithTimestamp(snapshotId, 'dbConnectionList'), [snapshotId]);
  if (!data) {
    return null;
  }

  const topQueries = (data as SnapshotData).get('raw_payload');
  if (topQueries.size === 0) {
    return null;
  }

  const rows: DbConnectRow[] = topQueries.toArray().map((topQuery: any, idx: any) => {
    return {
      key: String(idx),
      topQuery
    };
  });

  return (
    <Table
      withoutPadding
      cardTitle={t('in-sap:dashboards.dbConnection')}
      cols={cols}
      rows={rows}
      initialSortColumn={1}
      initialSortDirection="asc"
    />
  );
}

function Args({ args }: any) {
  return <code className={locals.statement}>{args}</code>;
}
