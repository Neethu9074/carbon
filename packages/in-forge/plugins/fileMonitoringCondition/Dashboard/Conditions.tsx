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
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

interface ConditionsProps {
  snapshotId: string;
  timeConfig: TimeConfig;
}

// Define the interface for the row data
interface ConditionsRow {
  key: string;
  snapshotId: string;
  timeConfig: TimeConfig;
  condition: {
    id: string;
    attribute: string;
    operator: string;
    reference: string;
    actual: string;
  };
}

// Define columns for the table
const cols = [
  {
    title: t('in-forge:plugins.FileMonitoringCondition.attribute'),
    type: 'string',
    typeArgs: {
      getValue(row: ConditionsRow) {
        return row.condition.attribute;
      }
    }
  },
  {
    title: t('in-forge:plugins.FileMonitoringCondition.operator'),
    type: 'string',
    typeArgs: {
      getValue(row: ConditionsRow) {
        return row.condition.operator;
      }
    }
  },
  {
    title: t('in-forge:plugins.FileMonitoringCondition.reference'),
    type: 'string',
    typeArgs: {
      getValue(row: ConditionsRow) {
        return row.condition.reference;
      }
    }
  },
  {
    title: t('in-forge:plugins.FileMonitoringCondition.actual'),
    type: 'string',
    typeArgs: {
      getValue(row: ConditionsRow) {
        return row.condition.actual;
      }
    }
  }
];

const Conditions: React.FC<ConditionsProps> = ({ snapshotId, timeConfig }) => {
  const data = useObservable(() => getRawPayloadWithTimestamp(snapshotId, 'monitors'), [snapshotId]);

  if (!data) {
    return null;
  }

  const monitorData = (data as SnapshotData).get('data');

  // Flatten the conditions from each monitor into rows
  const rows: ConditionsRow[] = monitorData
    .keySeq()
    .toArray()
    .flatMap((key: string) => {
      const monitor = monitorData.get(key);
      const conditions = monitor.conditions || [];
      return conditions.map((condition: any) => ({
        key: `${key}-${condition.id}`,
        snapshotId,
        timeConfig,
        condition
      }));
    });

  if (rows.length === 0) {
    return null;
  }

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.FileMonitoringCondition.dashboard.Conditions')}
      cols={cols}
      rows={rows}
    />
  );
};

export default Conditions;
