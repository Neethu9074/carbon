/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { useObservable } from '@instana/hooks';

// @ts-expect-error needs TS migration
import { SnapshotData, getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import Table from 'in-sdk/components/dashboard/Table';
import { shorten } from 'in-services/util/string';
import { t } from 'in-i18n';

interface LockEntryRow {
  key: string;
  lockEntry: Map<string, object>;
}

const cols = [
  {
    title: t('in-sap:dashboards.client'),
    type: 'string',
    typeArgs: {
      getValue(row: LockEntryRow) {
        return row.lockEntry.get('client');
      },
      getContent(args: any) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-sap:dashboards.userName'),
    type: 'string',
    typeArgs: {
      getValue(row: LockEntryRow) {
        return row.lockEntry.get('userName');
      },
      getContent(args: any) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-sap:dashboards.date'),
    type: 'string',
    typeArgs: {
      getValue(row: LockEntryRow) {
        return row.lockEntry.get('date');
      },
      getContent(args: any) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-sap:dashboards.time'),
    type: 'string',
    typeArgs: {
      getValue(row: LockEntryRow) {
        return row.lockEntry.get('time');
      },
      getContent(args: any) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-sap:dashboards.mode'),
    type: 'string',
    typeArgs: {
      getValue(row: LockEntryRow) {
        return row.lockEntry.get('mode');
      },
      getContent(args: any) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-sap:dashboards.object'),
    type: 'string',
    typeArgs: {
      getValue(row: LockEntryRow) {
        return row.lockEntry.get('object');
      },
      getContent(args: any) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-sap:dashboards.tableName'),
    type: 'string',
    typeArgs: {
      getValue(row: LockEntryRow) {
        return row.lockEntry.get('tableName');
      },
      getContent(args: any) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-sap:dashboards.workProcessNumber'),
    type: 'string',
    typeArgs: {
      getValue(row: LockEntryRow) {
        return row.lockEntry.get('workProcessNumber');
      },
      getContent(args: any) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-sap:dashboards.tCode'),
    type: 'string',
    typeArgs: {
      getValue(row: LockEntryRow) {
        return row.lockEntry.get('tCode');
      },
      getContent(args: any) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  }
];

export default function LockEntryList({ snapshotId }: SnapshotData) {
  const data = useObservable(() => getRawPayloadWithTimestamp(snapshotId, 'lockEntryStats'), [snapshotId]);
  const lockEntrys = data ? (data as SnapshotData).get('raw_payload') : null;
  const rows: LockEntryRow[] = lockEntrys
    ? lockEntrys.toArray().map((lockEntry: any, idx: any) => {
        return {
          key: String(idx),
          lockEntry
        };
      })
    : [];

  return (
    <Table
      withoutPadding
      cardTitle={t('in-sap:dashboards.LockEntryList')}
      cols={cols}
      rows={rows}
      initialSortColumn={0}
      initialSortDirection="asc"
    />
  );
}

function Args({ args }: any) {
  return <code>{args}</code>;
}
