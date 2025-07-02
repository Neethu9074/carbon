/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { useObservable } from '@instana/hooks';
import { TimeConfig } from '@instana/types';

// @ts-expect-error needs TS migration
import { SnapshotData, getRawPayloadWithTimestamp } from 'in-stores/snapshot';
// @ts-expect-error Module needs to be translated to TS
import { formatSql } from 'in-forge/tracing/jdbc/sql';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { megaBytes } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import Code from 'in-components/Code/Code';
import { t } from 'in-i18n';

interface DiskUsageStatsRow {
  key: string;
  snapshotId: string;
  diskUsageStats: Map<string, object>;
}

interface DiskUsageStatsProps {
  snapshotId: string;
  timeConfig: TimeConfig;
}

const cols = [
  {
    title: t('in-forge:plugins.sapHana.dashboard.host'),
    type: 'string',
    typeArgs: {
      getValue(row: DiskUsageStatsRow) {
        return row.diskUsageStats.get('host');
      }
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.diskId'),
    type: 'string',
    typeArgs: {
      getValue(row: DiskUsageStatsRow) {
        return row.diskUsageStats.get('diskId');
      }
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.deviceId'),
    type: 'string',
    typeArgs: {
      getValue(row: DiskUsageStatsRow) {
        return row.diskUsageStats.get('deviceId');
      }
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.diskTotalSize'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: DiskUsageStatsRow) {
        return row.snapshotId;
      },
      getMetricName(row: DiskUsageStatsRow) {
        return `diskUsageStats.${row.key}.totalSize`;
      },
      getContent: megaBytes.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.fileSystem'),
    type: 'string',
    typeArgs: {
      getValue(row: DiskUsageStatsRow) {
        return row.diskUsageStats.get('fileSystem');
      }
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.disksUsage'),
    type: 'string',
    typeArgs: {
      getValue(row: DiskUsageStatsRow) {
        return row.diskUsageStats.get('usage');
      }
    }
  },

  {
    title: t('in-forge:plugins.sapHana.dashboard.totalDeviceSize'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: DiskUsageStatsRow) {
        return row.snapshotId;
      },
      getMetricName(row: DiskUsageStatsRow) {
        return `diskUsageStats.${row.key}.totalDeviceSize`;
      },
      getContent: megaBytes.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.diskUsedSize'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: DiskUsageStatsRow) {
        return row.snapshotId;
      },
      getMetricName(row: DiskUsageStatsRow) {
        return `diskUsageStats.${row.key}.usedSize`;
      },
      getContent: megaBytes.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function DiskUsageStatsList({ snapshotId, timeConfig }: DiskUsageStatsProps) {
  const data = useObservable(
    () => getRawPayloadWithTimestamp(snapshotId, 'diskUsageStats', timeConfig),
    [snapshotId, timeConfig]
  );
  const diskUsageStat = data ? (data as SnapshotData).get('raw_payload', []) : null;
  const rows: DiskUsageStatsRow[] = diskUsageStat
    ? diskUsageStat
        .keySeq()
        .toArray()
        .map((key: string) => {
          const diskUsageStats = diskUsageStat.get(key);

          return {
            key,
            snapshotId,
            timeConfig,
            diskUsageStats
          };
        })
    : [];

  function getDetails(row: DiskUsageStatsRow) {
    return (
      <DashboardSection>
        <label>{t('in-forge:plugins.sapHana.dashboard.path')} : </label>
        <Code
          code={formatSql(row.diskUsageStats.get('path') == null ? '' : row.diskUsageStats.get('path'))}
          lang="bash"
          softWrap
          withExpandButton
        />
        <label>{t('in-forge:plugins.sapHana.dashboard.diskSubpath')} : </label>
        <Code
          code={formatSql(row.diskUsageStats.get('subpath') == null ? '' : row.diskUsageStats.get('subpath'))}
          lang="bash"
          softWrap
          withExpandButton
        />
        <label>{t('in-forge:plugins.sapHana.dashboard.mountSource')} : </label>
        <Code
          code={formatSql(row.diskUsageStats.get('mountSource') == null ? '' : row.diskUsageStats.get('mountSource'))}
          lang="bash"
          softWrap
        />
        <label>{t('in-forge:plugins.sapHana.dashboard.mountPath')} : </label>
        <Code
          code={formatSql(row.diskUsageStats.get('mountPath') == null ? '' : row.diskUsageStats.get('mountPath'))}
          lang="bash"
          softWrap
          withExpandButton
        />
        <label>{t('in-forge:plugins.sapHana.dashboard.mountDetails')} : </label>
        <Code
          code={formatSql(row.diskUsageStats.get('mountDetails') == null ? '' : row.diskUsageStats.get('mountDetails'))}
          lang="bash"
          softWrap
          withExpandButton
        />
      </DashboardSection>
    );
  }
  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.sapHana.dashboard.diskUsageStat')}
      cols={cols}
      rows={rows}
      initialSortColumn={5}
      getRowDetails={getDetails}
    />
  );
}
