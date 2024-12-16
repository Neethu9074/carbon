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
import { shorten } from 'in-services/util/string';
import { t } from 'in-i18n';

interface DumpStatsRow {
  key: string;
  snapshotId: string;
  dumpStats: Map<string, object>;
}

interface DumpStatsProps {
  snapshotId: string;
  timeConfig: TimeConfig;
}

const cols = [
  {
    title: t('in-sap:dashboards.client'),
    type: 'string',
    typeArgs: {
      getValue(row: DumpStatsRow) {
        return row.dumpStats.get('client');
      },
      getContent(args: any) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-sap:dashboards.user'),
    type: 'string',
    typeArgs: {
      getValue(row: DumpStatsRow) {
        return row.dumpStats.get('userName');
      },
      getContent(args: any) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-sap:abapsensor.date'),
    type: 'string',
    typeArgs: {
      getValue(row: DumpStatsRow) {
        return row.dumpStats.get('E2E_DATE');
      },
      getContent(args: any) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-sap:abapsensor.time'),
    type: 'string',
    typeArgs: {
      getValue(row: DumpStatsRow) {
        return row.dumpStats.get('E2E_TIME');
      },
      getContent(args: any) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-sap:dashboards.instance'),
    type: 'string',
    typeArgs: {
      getValue(row: DumpStatsRow) {
        return row.dumpStats.get('E2E_HOST');
      },
      getContent(args: any) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-sap:abapsensor.severity'),
    type: 'string',
    typeArgs: {
      getValue(row: DumpStatsRow) {
        return row.dumpStats.get('E2E_SEVERITY');
      },
      getContent(args: any) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-sap:abapsensor.errorId'),
    type: 'string',
    typeArgs: {
      getValue(row: DumpStatsRow) {
        return row.dumpStats.get('ERROR_ID');
      },
      getContent(args: any) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-sap:abapsensor.pgmName'),
    type: 'string',
    typeArgs: {
      getValue(row: DumpStatsRow) {
        return row.dumpStats.get('PGM_NAME');
      },
      getContent(args: any) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-sap:abapsensor.desc'),
    type: 'string',
    typeArgs: {
      getValue(row: DumpStatsRow) {
        return row.dumpStats.get('DESC');
      },
      getContent(args: any) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  }
];

export default function DumpStats({ snapshotId, timeConfig }: DumpStatsProps) {
  const data = useObservable(() => getRawPayloadWithTimestamp(snapshotId, 'abapdumpstats'), [snapshotId]);
  const dumpStat = data ? (data as SnapshotData).get('raw_payload', []) : null;
  const rows: DumpStatsRow[] = dumpStat
    ? dumpStat
        .keySeq()
        .toArray()
        .map((key: string) => {
          const dumpStats = dumpStat.get(key);
          return {
            key,
            snapshotId,
            timeConfig,
            dumpStats
          };
        })
    : [];

  return (
    <Table
      withoutPadding
      cardTitle={t('in-sap:dashboards.abapdumpstats')}
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
