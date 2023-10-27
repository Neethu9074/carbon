/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { List } from 'immutable';
import React from 'react';

import { TimeConfig } from '@instana/types';

import { number, bytesTwoDecimalPlaces } from 'in-services/formatters/number';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

const pathCol = {
  title: t('in-forge:plugins.oTelDatabase.dashboard.diskPath'),
  type: 'string',
  typeArgs: {
    getValue(row: any) {
      return row.name;
    }
  }
};

const usedCol = {
  title: t('in-forge:plugins.oTelDatabase.dashboard.diskUsage'),
  type: 'metric',
  typeArgs: {
    getSnapshotId(row: any) {
      return row.snapshotId;
    },
    getMetricName(row: any) {
      return 'db.disk.usage_' + row.name;
    },
    getContent: bytesTwoDecimalPlaces,
    getTimeWindowAggregation() {
      return 'mean';
    }
  }
};

const utilizationCol = {
  title: t('in-forge:plugins.oTelDatabase.dashboard.diskUtilization'),
  type: 'metric',
  typeArgs: {
    getSnapshotId(row: any) {
      return row.snapshotId;
    },
    getMetricName(row: any) {
      return 'db.disk.utilization_' + row.name;
    },
    getContent: number.detailed,
    getTimeWindowAggregation() {
      return 'mean';
    }
  }
};

export default function diskTable({ snapshot, timeConfig }: { snapshot: SnapshotData; timeConfig: TimeConfig }) {
  const snapshotId = snapshot.get('id') as string;
  const uniqueKeys = new Set();

  const rows = snapshot
    .getIn(['data', 'db.disk.usage'], List())
    .map((_value: any, key: string) => {
      // if (!uniqueKeys.has(key)) {
      uniqueKeys.add(key);
      return {
        key: key,
        name: key,
        timeConfig,
        snapshotId
      };
      // }
    })
    .filter(Boolean)
    .valueSeq()
    .toArray();

  if (rows.length === 0) {
    return null;
  }
  const cols = [pathCol, usedCol, utilizationCol];
  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.oTelDatabase.dashboard.disk', { count: rows.length })}
      cols={cols}
      rows={rows}
    />
  );
}
