/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { emptyMap } from 'in-services/fixedImmutables';
import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.ibmIOs.dashboard.tables.subsystems.subsystemName'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.subsystemStringData.get('subsystemName');
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmIOs.dashboard.tables.subsystems.libraryName'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.subsystemStringData.get('libraryName');
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmIOs.dashboard.tables.subsystems.activeJobs'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `subsystemMetrics.${row.key}.activeJobs`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmIOs.dashboard.tables.subsystems.maxActiveJobs'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `subsystemMetrics.${row.key}.maxActiveJobs`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmIOs.dashboard.tables.subsystems.description'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.subsystemStringData.get('description');
      }
    }
  }
];

export default function subsystemTable({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  const rows = snapshot
    .getIn(['data', 'subsystemStringMap'], emptyMap)
    .map((subsystemStringData, key) => {
      return {
        key,
        subsystemStringData,
        timeConfig,
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
      cardTitle={t('in-forge:plugins.ibmIOs.dashboard.tables.subsystems.name')}
      cols={cols}
      rows={rows}
      initialSortColumn={2}
      initialSortDirection="desc"
    />
  );
}
