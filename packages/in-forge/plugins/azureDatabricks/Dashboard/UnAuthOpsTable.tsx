/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { List } from 'immutable';
import { t } from 'in-i18n';

interface UnAuthOpRow {
  key: string;
  name: string;
  error: string;
  snapshotId: string;
}

const cols = [
  {
    title: t('in-forge:plugins.azureDatabricks.labelOpName'),
    type: 'string',
    typeArgs: {
      getValue({ name }: UnAuthOpRow) {
        return name;
      }
    }
  },
  {
    title: t('in-forge:plugins.azureDatabricks.labelOpError'),
    type: 'string',
    typeArgs: {
      getValue({ error }: UnAuthOpRow) {
        return error;
      }
    }
  },
  {
    title: t('in-forge:plugins.azureDatabricks.labelNumberOfAccess'),
    type: 'metric',
    typeArgs: {
      getSnapshotId({ snapshotId }: UnAuthOpRow) {
        return snapshotId;
      },
      getMetricName({ key }: UnAuthOpRow) {
        return `unityCatalog.unAuthOps.${key}`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function UnAuthOpsTable({
  snapshot,
  configuredLogAnalytics
}: {
  snapshot: SnapshotData;
  configuredLogAnalytics: string;
}) {
  const snapshotId = snapshot.get('id') as string;

  if (configuredLogAnalytics != 'OK') {
    return null;
  }

  const unAuthOpsIds = snapshot.getIn(['data', 'unityCatalog.unAuthOpsIds'], List());
  if (unAuthOpsIds.length == 0) {
    return null;
  }

  const rows: UnAuthOpRow[] = unAuthOpsIds.toArray().map((unAuthOpKey: string) => {
    const index = unAuthOpKey.indexOf('/');
    return {
      key: unAuthOpKey,
      name: unAuthOpKey.substring(0, index),
      error: unAuthOpKey.substring(index + 1),
      snapshotId
    };
  });

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.azureDatabricks.titleUnAuthOpsCount', {
        count: rows.length
      })}
      cols={cols}
      rows={rows}
      initialSortDirection="desc"
      initialSortColumn={2}
    />
  );
}
