/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { TimeConfig } from '@instana/types';

import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { emptyMap } from 'in-services/fixedImmutables';
import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.oTelDatabase.dashboard.tableName'),
    type: 'string',
    typeArgs: {
      getValue(row: any) {
        return row.name;
      }
    }
  },
  {
    title: t('in-forge:plugins.oTelDatabase.dashboard.seqScanCount'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: any) {
        return row.snapshotId;
      },
      getMetricName(row: any) {
        return 'db.seq.scan.count_' + row.name;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function sequentialScanTable({
  snapshot,
  timeConfig
}: {
  snapshot: SnapshotData;
  timeConfig: TimeConfig;
}) {
  const snapshotId = snapshot.get('id') as string;

  const rows = snapshot
    .getIn(['data', 'db.seq.scan.count'], emptyMap)
    .map((_value: any, key: string) => {
      return {
        key: key,
        name: key,
        timeConfig,
        snapshotId
      };
    })
    .filter(Boolean)
    .valueSeq()
    .toArray();

  if (rows.length === 0) {
    return null;
  }

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.oTelDatabase.dashboard.seqScanCount', { count: rows.length })}
      cols={cols}
      rows={rows}
      getRowDetails={getRowDetails}
    />
  );
}

function getRowDetails(row: any) {
  const snapshotId = row.snapshotId;
  const timeConfig = row.timeConfig;

  return (
    <div>
      <Chart
        snapshotId={snapshotId}
        timeConfig={timeConfig}
        y1={{
          metrics: ['db.seq.scan.count_' + row.name],
          labels: [t('in-forge:plugins.oTelDatabase.dashboard.seqScanCount')],
          type: 'line',
          formatter: number.compact
        }}
      />
    </div>
  );
}
