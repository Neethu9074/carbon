/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { TimeConfig } from '@instana/types';

import { WINDOW_FOR_LATEST_METRIC } from 'in-forge/plugins/oTelDatabase/constants';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { seconds } from 'in-services/formatters/number';
import { emptyMap } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.oTelDatabase.dashboard.sqlId'),
    type: 'string',
    typeArgs: {
      getValue(row: any) {
        return row.name;
      }
    }
  },
  {
    title: t('in-forge:plugins.oTelDatabase.dashboard.sqlText'),
    type: 'string',
    typeArgs: {
      getValue(row: any) {
        return row.elapsedTime.get('sql_text');
      }
    }
  },
  {
    title: t('in-forge:plugins.oTelDatabase.dashboard.elapsed_time'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: any) {
        return row.snapshotId;
      },
      getMetricName(row: any) {
        return 'db.sql.elapsed_time.' + row.key + '.value';
      },
      getContent: seconds.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      },
      getWindowForLatest() {
        return WINDOW_FOR_LATEST_METRIC;
      }
    }
  }
];

export default function elapsedTimeTable({ snapshot, timeConfig }: { snapshot: SnapshotData; timeConfig: TimeConfig }) {
  const snapshotId = snapshot.get('id') as string;

  const rows = snapshot
    .getIn(['data', 'db.sql.elapsed_time'], emptyMap)
    .map((elapsedTime: any, name: any) => {
      return {
        key: name,
        name: name,
        elapsedTime,
        timeConfig,
        snapshot,
        snapshotId
      };
    })
    .valueSeq()
    .toArray();

  if (rows.length === 0) {
    return null;
  }

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.oTelDatabase.dashboard.elapsed_time', { count: rows.length })}
      cols={cols}
      rows={rows}
    />
  );
}
