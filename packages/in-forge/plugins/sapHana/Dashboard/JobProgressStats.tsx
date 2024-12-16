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
// @ts-expect-error needs TS migration
import { formatSql } from 'in-forge/tracing/jdbc/sql';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection/DashboardSection';
import { formatDateTime } from 'in-services/formatters/date';
import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import Code from 'in-components/Code';
import { t } from 'in-i18n';

interface JobProgressStatsRow {
  key: string;
  snapshotId: string;
  jobProgressStats: Map<string, object>;
}

interface JobProgressStatsProps {
  snapshotId: string;
  timeConfig: TimeConfig;
}

const cols = [
  {
    title: t('in-forge:plugins.sapHana.dashboard.host'),
    type: 'string',
    typeArgs: {
      getValue(row: JobProgressStatsRow) {
        return row.jobProgressStats.get('host');
      }
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.port'),
    type: 'string',
    typeArgs: {
      getValue(row: JobProgressStatsRow) {
        return row.jobProgressStats.get('port');
      }
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.schemaName'),
    type: 'string',
    typeArgs: {
      getValue(row: JobProgressStatsRow) {
        return row.jobProgressStats.get('schemaName');
      }
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.jobName'),
    type: 'string',
    typeArgs: {
      getValue(row: JobProgressStatsRow) {
        return row.jobProgressStats.get('jobName');
      }
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.currentProgress'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: JobProgressStatsRow) {
        return row.snapshotId;
      },
      getMetricName(row: JobProgressStatsRow) {
        return `jobProgressStats.${row.key}.currentProgress`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.maxProgress'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: JobProgressStatsRow) {
        return row.snapshotId;
      },
      getMetricName(row: JobProgressStatsRow) {
        return `jobProgressStats.${row.key}.maxProgress`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.startTime'),
    type: 'string',
    typeArgs: {
      getValue(row: JobProgressStatsRow) {
        return row.jobProgressStats.get('startTime');
      },
      getContent: formatDateTime
    }
  }
];
function getDetails(row: JobProgressStatsRow) {
  return (
    <>
      <DashboardSection>
        <label>{t('in-forge:plugins.sapHana.dashboard.connectionId')} :</label>
        <Code
          code={formatSql(
            row.jobProgressStats.get('connectionId') == null ? '' : row.jobProgressStats.get('connectionId')
          )}
          lang="bash"
          softWrap
          withExpandButton
        />
        <label>{t('in-forge:plugins.sapHana.dashboard.progressDetail')} :</label>
        <Code
          code={formatSql(
            row.jobProgressStats.get('progressDetail') == null ? '' : row.jobProgressStats.get('progressDetail')
          )}
          lang="bash"
          softWrap
          withExpandButton
        />
      </DashboardSection>
    </>
  );
}
export default function JobProgressStatsList({ snapshotId, timeConfig }: JobProgressStatsProps) {
  const data = useObservable(() => getRawPayloadWithTimestamp(snapshotId, 'jobProgressStats'), [snapshotId]);
  const jobProgressStat = data ? (data as SnapshotData).get('raw_payload', []) : null;
  const rows: JobProgressStatsRow[] = jobProgressStat
    ? jobProgressStat
        .keySeq()
        .toArray()
        .map((key: string) => {
          const jobProgressStats = jobProgressStat.get(key);
          return {
            key,
            snapshotId,
            timeConfig,
            jobProgressStats
          };
        })
    : [];
  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.sapHana.dashboard.jobProgressStats')}
      cols={cols}
      rows={rows}
      getRowDetails={getDetails}
      initialSortColumn={6}
      initialSortDirection="desc"
    />
  );
}
