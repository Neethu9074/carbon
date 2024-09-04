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

interface SpoolMetricRow {
  key: string;
  snapshotId: string;
  spoolStats: Map<string, object>;
}

interface SpoolMetricStatsProps {
  snapshotId: string;
  timeConfig: TimeConfig;
}

const cols = [
  {
    title: t('in-sap:dashboards.destination'),
    type: 'string',
    typeArgs: {
      getValue(row: SpoolMetricRow) {
        return row.spoolStats.get('destination');
      }
    }
  },
  {
    title: t('in-sap:dashboards.deviceName'),
    type: 'string',
    typeArgs: {
      getValue(row: SpoolMetricRow) {
        return row.spoolStats.get('deviceName');
      }
    }
  },
  {
    title: t('in-sap:dashboards.accessMethod'),
    type: 'string',
    typeArgs: {
      getValue(row: SpoolMetricRow) {
        return row.spoolStats.get('accessMethod');
      }
    }
  },
  {
    title: t('in-sap:dashboards.message'),
    type: 'string',
    typeArgs: {
      getValue(row: SpoolMetricRow) {
        return row.spoolStats.get('message');
      }
    }
  },
  {
    title: t('in-sap:dashboards.status'),
    type: 'string',
    typeArgs: {
      getValue(row: SpoolMetricRow) {
        return row.spoolStats.get('statusDesc');
      }
    }
  }
];

export default function SpoolMetricStat({ snapshotId, timeConfig }: SpoolMetricStatsProps) {
  const data = useObservable(() => getRawPayloadWithTimestamp(snapshotId, 'spoolMetricStats'), [snapshotId]);
  if (!data) {
    return null;
  }
  const spoolStat = (data as SnapshotData).get('raw_payload', []);
  const rows: SpoolMetricRow[] = spoolStat
    .keySeq()
    .toArray()
    .map((key: string) => {
      const spoolStats = spoolStat.get(key);

      return {
        key,
        snapshotId,
        timeConfig,
        spoolStats
      };
    });

  return (
    <Table
      withoutPadding
      cardTitle={t('in-sap:dashboards.spoolMetricStat')}
      cols={cols}
      rows={rows}
      initialSortColumn={0}
      initialSortDirection="asc"
    />
  );
}
