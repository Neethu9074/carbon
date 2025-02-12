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

interface SystemEventStatsRow {
  key: string;
  snapshotId: string;
  systemEventStats: Map<string, object>;
}

interface SystemEventStatsProps {
  snapshotId: string;
  timeConfig: TimeConfig;
}

const cols = [
  {
    title: t('in-forge:plugins.sapHana.dashboard.host'),
    type: 'string',
    typeArgs: {
      getValue(row: SystemEventStatsRow) {
        return row.systemEventStats.get('host');
      }
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.eventName'),
    type: 'string',
    typeArgs: {
      getValue(row: SystemEventStatsRow) {
        return row.systemEventStats.get('eventName');
      }
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.serviceName'),
    type: 'string',
    typeArgs: {
      getValue(row: SystemEventStatsRow) {
        return row.systemEventStats.get('serviceName');
      }
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.systemStatus'),
    type: 'string',
    typeArgs: {
      getValue(row: SystemEventStatsRow) {
        return row.systemEventStats.get('systemStatus');
      }
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.serviceStatus'),
    type: 'string',
    typeArgs: {
      getValue(row: SystemEventStatsRow) {
        return row.systemEventStats.get('serviceStatus');
      }
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.eventTime'),
    type: 'string',
    typeArgs: {
      getValue(row: SystemEventStatsRow) {
        return row.systemEventStats.get('eventTime');
      },
      getContent: formatDateTime
    }
  }
];

export default function SystemEventStatsList({ snapshotId, timeConfig }: SystemEventStatsProps) {
  const data = useObservable(
    () => getRawPayloadWithTimestamp(snapshotId, 'systemEventStats', timeConfig),
    [snapshotId, timeConfig]
  );
  const systemEventStat = data ? (data as SnapshotData).get('raw_payload', []) : null;
  const rows: SystemEventStatsRow[] = systemEventStat
    ? systemEventStat
        .keySeq()
        .toArray()
        .map((key: string) => {
          const systemEventStats = systemEventStat.get(key);
          return {
            key,
            snapshotId,
            timeConfig,
            systemEventStats
          };
        })
    : [];

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.sapHana.dashboard.systemEventStats')}
      cols={cols}
      rows={rows}
      initialSortColumn={5}
      initialSortDirection="desc"
    />
  );
}
