/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { List } from 'immutable';
import React from 'react';

import { TimeConfig } from '@instana/types';

import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

const typeCol = {
  title: t('in-forge:plugins.oTelDatabase.dashboard.lockType'),
  type: 'string',
  typeArgs: {
    getValue(row: any) {
      return row.name;
    }
  }
};

const valueCol = {
  title: t('in-forge:plugins.oTelDatabase.dashboard.lockCountValue'),
  type: 'metric',
  typeArgs: {
    getSnapshotId(row: any) {
      return row.snapshotId;
    },
    getMetricName(row: any) {
      return 'db.lock.count_' + row.name;
    },
    getContent: number.compact,
    getTimeWindowAggregation() {
      return 'mean';
    }
  }
};

export default function lockCountTable({ snapshot, timeConfig }: { snapshot: SnapshotData; timeConfig: TimeConfig }) {
  const snapshotId = snapshot.get('id') as string;

  const rows = snapshot
    .getIn(['data', 'db.lock.count'], List())
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
  const cols = [typeCol, valueCol];
  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.oTelDatabase.dashboard.lockCount', { count: rows.length })}
      cols={cols}
      rows={rows}
    />
  );
}
