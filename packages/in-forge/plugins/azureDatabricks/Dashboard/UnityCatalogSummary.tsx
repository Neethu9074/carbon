/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

interface SummaryRow {
  key: string;
}

const cols = [
  {
    title: t('in-forge:plugins.azureDatabricks.labelTotalCatalogs'),
    type: 'metric',
    typeArgs: {
      getSnapshotId({ key }: SummaryRow) {
        return key;
      },
      getMetricName() {
        return 'unityCatalog.catalogs';
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.azureDatabricks.labelTotalSchemas'),
    type: 'metric',
    typeArgs: {
      getSnapshotId({ key }: SummaryRow) {
        return key;
      },
      getMetricName() {
        return 'unityCatalog.schemas';
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.azureDatabricks.labelTotalTables'),
    type: 'metric',
    typeArgs: {
      getSnapshotId({ key }: SummaryRow) {
        return key;
      },
      getMetricName() {
        return 'unityCatalog.tables';
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.azureDatabricks.labelTotalViews'),
    type: 'metric',
    typeArgs: {
      getSnapshotId({ key }: SummaryRow) {
        return key;
      },
      getMetricName() {
        return 'unityCatalog.views';
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.azureDatabricks.labelTotalVolumes'),
    type: 'metric',
    typeArgs: {
      getSnapshotId({ key }: SummaryRow) {
        return key;
      },
      getMetricName() {
        return 'unityCatalog.volumes';
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function UnityCatalogSummary({
  snapshotId
}: {
  snapshotId: string
}) {
  const rows: SummaryRow[] = [{
      key: snapshotId
    }];

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.azureDatabricks.titleSummary')}
      cols={cols}
      rows={rows}
    />
  );
}
