/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { useObservable } from '@instana/hooks';

// @ts-expect-error needs TS migration
import { SnapshotData, getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

interface ConditionsProps {
  snapshotId: string;
}

// Define the interface for the row data
interface ConditionsRow {
  key: any;
  condition: any;
}

// Define columns for the table
const cols = [
  {
    title: t('in-forge:plugins.fileMonitoringCondition.dashboard.conditionType'),
    type: 'string',
    typeArgs: {
      getValue(row: ConditionsRow) {
        return row.condition.get('fileMetric') || row.condition.get('filePath');
      }
    }
  },
  {
    title: t('in-forge:plugins.fileMonitoringCondition.dashboard.operator'),
    type: 'string',
    typeArgs: {
      getValue(row: ConditionsRow) {
        return row.condition.get('operator');
      }
    }
  },
  {
    title: t('in-forge:plugins.fileMonitoringCondition.dashboard.reference'),
    type: 'string',
    typeArgs: {
      getValue(row: ConditionsRow) {
        return row.condition.get('referenceValue');
      }
    }
  },
  {
    title: t('in-forge:plugins.fileMonitoringCondition.dashboard.actual'),
    type: 'string',
    typeArgs: {
      getValue(row: ConditionsRow) {
        return row.condition.get('actualValue');
      }
    }
  }
];

const Conditions: React.FC<ConditionsProps> = ({ snapshotId }) => {
  const data = useObservable(() => getRawPayloadWithTimestamp(snapshotId, 'conditions'), [snapshotId]);
  if (!data) {
    return null;
  }
  const monitorData = (data as SnapshotData).get('raw_payload');
  // Flatten the conditions from each monitor into rows
  const rows: ConditionsRow[] = monitorData.toArray().flatMap((condition: any) => {
    const conditionKey = condition.get('fileMetric') || condition.get('filePath');
    return {
      key: `${conditionKey}`,
      condition
    };
  });

  if (rows.length === 0) {
    return null;
  }

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.fileMonitoringCondition.conditions')}
      cols={cols}
      rows={rows}
    />
  );
};

export default Conditions;
