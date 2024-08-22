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
    title: t('in-forge:plugins.sapHana.dashboard.eventTime'),
    type: 'string',
    typeArgs: {
      getValue(row: SystemEventStatsRow) {
        return row.systemEventStats.get('eventTime');
      },
      getContent: formatDateTime
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
    title: t('in-forge:plugins.sapHana.dashboard.eventDetail'),
    type: 'string',
    typeArgs: {
      getValue(row: SystemEventStatsRow) {
        return row.systemEventStats.get('eventDetail');
      }
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.errorMsg'),
    type: 'string',
    typeArgs: {
      getValue(row: SystemEventStatsRow) {
        return row.systemEventStats.get('errorMessage');
      }
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.systemActive'),
    type: 'string',
    typeArgs: {
      getValue(row: SystemEventStatsRow) {
        return row.systemEventStats.get('systemActive');
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
    title: t('in-forge:plugins.sapHana.dashboard.hostStatus'),
    type: 'string',
    typeArgs: {
      getValue(row: SystemEventStatsRow) {
        return row.systemEventStats.get('hostStatus');
      }
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.hostActive'),
    type: 'string',
    typeArgs: {
      getValue(row: SystemEventStatsRow) {
        return row.systemEventStats.get('hostActive');
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
    title: t('in-forge:plugins.sapHana.dashboard.databaseName'),
    type: 'string',
    typeArgs: {
      getValue(row: SystemEventStatsRow) {
        return row.systemEventStats.get('databaseName');
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
  }
];

export default function SystemEventStatsList({ snapshotId, timeConfig }: SystemEventStatsProps) {
  const data = useObservable(() => getRawPayloadWithTimestamp(snapshotId, 'systemEventStats'), [snapshotId]);
  if (!data) {
    return null;
  }
  const systemEventStat = (data as SnapshotData).get('raw_payload', []);
  const rows: SystemEventStatsRow[] = systemEventStat
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
    });

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.sapHana.dashboard.systemEventStats')}
      cols={cols}
      rows={rows}
      initialSortColumn={1}
      initialSortDirection="desc"
    />
  );
}
