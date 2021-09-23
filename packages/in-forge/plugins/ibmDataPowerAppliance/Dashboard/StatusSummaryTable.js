/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.ibmDataPowerAppliance.workList'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return `workList`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmDataPowerAppliance.quiescedDomains'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return `quiescedDomains`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmDataPowerAppliance.inactiveObjects'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return `inactiveObjects`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];
export default function StatusSummaryTable({ snapshot, timeConfig }) {
  if (snapshot == null || snapshot.length === 0) {
    return null;
  }

  const rows = [
    {
      key: snapshot.get('id'),
      snapshotId: snapshot.get('id'),
      snapshot: snapshot,
      timeConfig
    }
  ];
  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.ibmDataPowerAppliance.statusSummaryTitle')}
      cols={cols}
      rows={rows}
    />
  );
}
