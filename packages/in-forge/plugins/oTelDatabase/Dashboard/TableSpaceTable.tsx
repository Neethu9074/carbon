/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { List } from 'immutable';
import React from 'react';

import { TimeConfig } from '@instana/types';

import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { WINDOW_FOR_LATEST_METRIC } from 'in-forge/plugins/oTelDatabase/constants';
import { number, bytesTwoDecimalPlaces } from 'in-services/formatters/number';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

const typeCol = {
  title: t('in-forge:plugins.oTelDatabase.dashboard.tableSpaceName'),
  type: 'string',
  typeArgs: {
    getValue(row: any) {
      return row.name;
    }
  }
};

const sizeCol = {
  title: t('in-forge:plugins.oTelDatabase.dashboard.tableSpaceSize'),
  type: 'metric',
  typeArgs: {
    getSnapshotId(row: any) {
      return row.snapshotId;
    },
    getMetricName(row: any) {
      return 'db.tablespace.size_' + row.name;
    },
    getContent: bytesTwoDecimalPlaces,
    getTimeWindowAggregation() {
      return 'mean';
    },
    getWindowForLatest() {
      return WINDOW_FOR_LATEST_METRIC;
    }
  }
};

const usedCol = {
  title: t('in-forge:plugins.oTelDatabase.dashboard.tableSpaceUsed'),
  type: 'metric',
  typeArgs: {
    getSnapshotId(row: any) {
      return row.snapshotId;
    },
    getMetricName(row: any) {
      return 'db.tablespace.used_' + row.name;
    },
    getContent: bytesTwoDecimalPlaces,
    getTimeWindowAggregation() {
      return 'mean';
    },
    getWindowForLatest() {
      return WINDOW_FOR_LATEST_METRIC;
    }
  }
};

const utilizationCol = {
  title: t('in-forge:plugins.oTelDatabase.dashboard.tableSpaceUtilization'),
  type: 'metric',
  typeArgs: {
    getSnapshotId(row: any) {
      return row.snapshotId;
    },
    getMetricName(row: any) {
      return 'db.tablespace.utilization_' + row.name;
    },
    getContent: number.detailed,
    getTimeWindowAggregation() {
      return 'mean';
    },
    getWindowForLatest() {
      return WINDOW_FOR_LATEST_METRIC;
    }
  }
};

const maxCol = {
  title: t('in-forge:plugins.oTelDatabase.dashboard.tableSpaceMax'),
  type: 'metric',
  typeArgs: {
    getSnapshotId(row: any) {
      return row.snapshotId;
    },
    getMetricName(row: any) {
      return 'db.tablespace.max_' + row.name;
    },
    getContent: bytesTwoDecimalPlaces,
    getTimeWindowAggregation() {
      return 'mean';
    },
    getWindowForLatest() {
      return WINDOW_FOR_LATEST_METRIC;
    }
  }
};

export default function tableSpaceTable({ snapshot, timeConfig }: { snapshot: SnapshotData; timeConfig: TimeConfig }) {
  const snapshotId = snapshot.get('id') as string;
  const uniqueKeys = new Set();

  const semconvens = ['size', 'utilization', 'used', 'max'];
  let rows = [];
  for (const semconv of semconvens) {
    const data = snapshot.getIn(['data', `db.tablespace.${semconv}`], List());
    if (data.size > 0) {
      rows = data
        .map((_value: any, key: string) => {
          if (!uniqueKeys.has(key)) {
            uniqueKeys.add(key);
            return {
              key: key,
              name: key,
              timeConfig,
              snapshotId
            };
          }
          return null;
        })
        .filter(Boolean)
        .valueSeq()
        .toArray();

      break;
    }
  }
  if (rows.length === 0) {
    return null;
  }
  const cols = [typeCol, sizeCol, usedCol, utilizationCol, maxCol];
  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.oTelDatabase.dashboard.tableSpace', { count: rows.length })}
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
          metrics: [
            'db.tablespace.size_' + row.name,
            'db.tablespace.used_' + row.name,
            'db.tablespace.max_' + row.name
          ],
          labels: [
            t('in-forge:plugins.oTelDatabase.dashboard.tableSpaceSize'),
            t('in-forge:plugins.oTelDatabase.dashboard.tableSpaceUsed'),
            t('in-forge:plugins.oTelDatabase.dashboard.tableSpaceMax')
          ],
          type: 'line',
          formatter: bytesTwoDecimalPlaces
        }}
        y2={{
          metrics: ['db.tablespace.utilization_' + row.name],
          labels: [t('in-forge:plugins.oTelDatabase.dashboard.tableSpaceUtilization')],
          type: 'line',
          formatter: number.detailed
        }}
      />
    </div>
  );
}
