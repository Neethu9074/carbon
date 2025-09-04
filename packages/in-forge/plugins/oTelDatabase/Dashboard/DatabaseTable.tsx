/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { List } from 'immutable';
import React from 'react';

import { TimeConfig } from '@instana/types';

import { SnapshotData } from 'in-stores/snapshot/snapshot';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

const typeCol = {
  title: t('in-forge:plugins.oTelDatabase.dashboard.dbName'),
  type: 'string',
  typeArgs: {
    getValue(row: any) {
      return row.name;
    }
  }
};

const getStatusLabel = (value: number) => {
  switch (value) {
    case 0:
      return 'Disabled';
    case 1:
      return 'Enabled';
    default:
      return '-';
  }
};

const logEnabled = {
  title: t('in-forge:plugins.oTelDatabase.dashboard.dbLogEnabled'),
  type: 'metric',
  typeArgs: {
    getSnapshotId(row: any) {
      return row.snapshotId;
    },
    getMetricName(row: any) {
      return 'db.database.log.enabled_' + row.name;
    },
    getContent: getStatusLabel,
    getTimeWindowAggregation() {
      return 'mean';
    }
  }
};

const buffLogEnabled = {
  title: t('in-forge:plugins.oTelDatabase.dashboard.dbBuffLogEnabled'),
  type: 'metric',
  typeArgs: {
    getSnapshotId(row: any) {
      return row.snapshotId;
    },
    getMetricName(row: any) {
      return 'db.database.buff.log.enabled_' + row.name;
    },
    getContent: getStatusLabel,
    getTimeWindowAggregation() {
      return 'mean';
    }
  }
};

const caseInsensitive = {
  title: t('in-forge:plugins.oTelDatabase.dashboard.dbCaseInsensitive'),
  type: 'metric',
  typeArgs: {
    getSnapshotId(row: any) {
      return row.snapshotId;
    },
    getMetricName(row: any) {
      return 'db.database.case.insensitive_' + row.name;
    },
    getContent: getStatusLabel,
    getTimeWindowAggregation() {
      return 'mean';
    }
  }
};

const ansiCompliant = {
  title: t('in-forge:plugins.oTelDatabase.dashboard.dbAnsiCompliant'),
  type: 'metric',
  typeArgs: {
    getSnapshotId(row: any) {
      return row.snapshotId;
    },
    getMetricName(row: any) {
      return 'db.database.ansi.compliant_' + row.name;
    },
    getContent: getStatusLabel,
    getTimeWindowAggregation() {
      return 'mean';
    }
  }
};

const nlsEnabled = {
  title: t('in-forge:plugins.oTelDatabase.dashboard.dbNlsEnabled'),
  type: 'metric',
  typeArgs: {
    getSnapshotId(row: any) {
      return row.snapshotId;
    },
    getMetricName(row: any) {
      return 'db.database.nls.enabled_' + row.name;
    },
    getContent: getStatusLabel,
    getTimeWindowAggregation() {
      return 'mean';
    }
  }
};

export default function databaseTable({ snapshot, timeConfig }: { snapshot: SnapshotData; timeConfig: TimeConfig }) {
  const snapshotId = snapshot.get('id') as string;
  const uniqueKeys = new Set();

  const semconvens = ['log.enabled', 'buff.log.enabled', 'case.insensitive', 'ansi.compliant', 'nls.enabled'];
  let rows = [];
  for (const semconv of semconvens) {
    const data = snapshot.getIn(['data', `db.database.${semconv}`], List());
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
  const cols = [typeCol, logEnabled, buffLogEnabled, caseInsensitive, ansiCompliant, nlsEnabled];
  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.oTelDatabase.dashboard.database', { count: rows.length })}
      cols={cols}
      rows={rows}
    />
  );
}
