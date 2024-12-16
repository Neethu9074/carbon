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
import { formatDateTime } from 'in-services/formatters/date';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

interface SchedulerJobsStatsRow {
  key: string;
  snapshotId: string;
  schedulerJobsStats: Map<string, object>;
}

interface SchedulerJobsStatsProps {
  snapshotId: string;
  timeConfig: TimeConfig;
}

const cols = [
  {
    title: t('in-forge:plugins.sapHana.dashboard.userName'),
    type: 'string',
    typeArgs: {
      getValue(row: SchedulerJobsStatsRow) {
        return row.schedulerJobsStats.get('userName');
      }
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.schemaName'),
    type: 'string',
    typeArgs: {
      getValue(row: SchedulerJobsStatsRow) {
        return row.schedulerJobsStats.get('schemaName');
      }
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.schedulerJobName'),
    type: 'string',
    typeArgs: {
      getValue(row: SchedulerJobsStatsRow) {
        return row.schedulerJobsStats.get('schedulerJobName');
      }
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.status'),
    type: 'string',
    typeArgs: {
      getValue(row: SchedulerJobsStatsRow) {
        return row.schedulerJobsStats.get('status');
      }
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.startTime'),
    type: 'string',
    typeArgs: {
      getValue(row: SchedulerJobsStatsRow) {
        return row.schedulerJobsStats.get('startTime');
      },
      getContent: formatDateTime
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.endTime'),
    type: 'string',
    typeArgs: {
      getValue(row: SchedulerJobsStatsRow) {
        return row.schedulerJobsStats.get('endTime');
      },
      getContent: formatDateTime
    }
  }
];
export default function SchedulerJobsStatsList({ snapshotId, timeConfig }: SchedulerJobsStatsProps) {
  const data = useObservable(() => getRawPayloadWithTimestamp(snapshotId, 'schedulerJobStats'), [snapshotId]);
  const schedulerJobsStat = data ? (data as SnapshotData).get('raw_payload', []) : null;
  const rows: SchedulerJobsStatsRow[] = schedulerJobsStat
    ? schedulerJobsStat
        .keySeq()
        .toArray()
        .map((key: string) => {
          const schedulerJobsStats = schedulerJobsStat.get(key);
          return {
            key,
            snapshotId,
            timeConfig,
            schedulerJobsStats
          };
        })
    : [];
  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.sapHana.dashboard.schedulerJobStats')}
      cols={cols}
      rows={rows}
      initialSortColumn={4}
      initialSortDirection="desc"
    />
  );
}
