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
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { bytesTwoDecimalPlaces } from 'in-services/formatters/number';
import { millis } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

interface DiskRow {
  key: string;
  snapshotId: string;
  diskInfo: Map<string, number>;
}

interface DiskProps {
  snapshotId: string;
  timeConfig: TimeConfig;
}

const cols = [
  {
    title: t('in-forge:plugins.host.dashboard.device'),
    type: 'string',
    typeArgs: {
      getValue(row: DiskRow) {
        return row.diskInfo.get('device');
      }
    }
  },
  {
    title: t('in-forge:plugins.host.dashboard.readAwaitTime'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: DiskRow) {
        return row.snapshotId;
      },
      getMetricName(row: DiskRow) {
        return `disk.${row.key}.readAwaitTime`;
      },
      getContent: millis.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.host.dashboard.writeAwaitTime'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: DiskRow) {
        return row.snapshotId;
      },
      getMetricName(row: DiskRow) {
        return `disk.${row.key}.writeAwaitTime`;
      },
      getContent: millis.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.host.dashboard.avgDiscardRequestsTime'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: DiskRow) {
        return row.snapshotId;
      },
      getMetricName(row: DiskRow) {
        return `disk.${row.key}.avgDiscardRequestsTime`;
      },
      getContent: millis.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.host.dashboard.avgFlushRequestsTime'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: DiskRow) {
        return row.snapshotId;
      },
      getMetricName(row: DiskRow) {
        return `disk.${row.key}.avgFlushRequestsTime`;
      },
      getContent: millis.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

const DiskTable = function DiskInfo({ snapshotId, timeConfig }: DiskProps) {
  const data = useObservable(() => getRawPayloadWithTimestamp(snapshotId, 'disk'), [snapshotId]);

  if (!data) {
    return null;
  }

  const disk = (data as SnapshotData).get('raw_payload');
  const rows: DiskRow[] = disk
    .keySeq()
    .toArray()
    .map((key: string) => {
      const diskInfo = disk.get(key);
      return {
        key,
        snapshotId,
        timeConfig,
        diskInfo
      };
    });

  if (rows.length === 0) {
    return null;
  }
  function getDetails(row: DiskRow) {
    return (
      <div>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: bytesTwoDecimalPlaces,
            metrics: [
              `disk.${row.key}.readAwaitTime`,
              `disk.${row.key}.writeAwaitTime`,
              `disk.${row.key}.avgDiscardRequestsTime`,
              `disk.${row.key}.avgFlushRequestsTime`
            ],
            labels: [
              t('in-forge:plugins.host.dashboard.readAwaitTime'),
              t('in-forge:plugins.host.dashboard.writeAwaitTime'),
              t('in-forge:plugins.host.dashboard.avgDiscardRequestsTime'),
              t('in-forge:plugins.host.dashboard.avgFlushRequestsTime')
            ],
            type: 'line'
          }}
        />
      </div>
    );
  }

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.host.dashboard.disk', {
        count: rows.length
      })}
      cols={cols}
      rows={rows}
      getRowDetails={getDetails}
      maxItemsPerPage={8}
    />
  );
};

export default DiskTable;
