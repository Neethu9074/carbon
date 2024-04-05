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

interface CatalogRow {
  key: string;
  name: string;
  kind: string;
  snapshotId: string;
}

const cols = [
  {
    title: t('in-forge:plugins.azureDatabricks.labelCatalogName'),
    type: 'string',
    typeArgs: {
      getValue({ name }: CatalogRow) {
        return name;
      }
    }
  },
  {
    title: t('in-forge:plugins.azureDatabricks.labelCatalogKind'),
    type: 'string',
    typeArgs: {
      getValue({ kind }: CatalogRow) {
        return kind;
      }
    }
  },
  {
    title: t('in-forge:plugins.azureDatabricks.labelTotalSchemas'),
    type: 'metric',
    typeArgs: {
      getSnapshotId({ snapshotId }: CatalogRow) {
        return snapshotId;
      },
      getMetricName({ key }: CatalogRow) {
        return `unityCatalog.catalogList.${key}.schemas`;
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
      getSnapshotId({ snapshotId }: CatalogRow) {
        return snapshotId;
      },
      getMetricName({ key }: CatalogRow) {
        return `unityCatalog.catalogList.${key}.tables`;
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
      getSnapshotId({ snapshotId }: CatalogRow) {
        return snapshotId;
      },
      getMetricName({ key }: CatalogRow) {
        return `unityCatalog.catalogList.${key}.views`;
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
      getSnapshotId({ snapshotId }: CatalogRow) {
        return snapshotId;
      },
      getMetricName({ key }: CatalogRow) {
        return `unityCatalog.catalogList.${key}.volumes`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.azureDatabricks.labelTotalMLModels'),
    type: 'metric',
    typeArgs: {
      getSnapshotId({ snapshotId }: CatalogRow) {
        return snapshotId;
      },
      getMetricName({ key }: CatalogRow) {
        return `unityCatalog.catalogList.${key}.mlModels`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.azureDatabricks.labelTotalFunctions'),
    type: 'metric',
    typeArgs: {
      getSnapshotId({ snapshotId }: CatalogRow) {
        return snapshotId;
      },
      getMetricName({ key }: CatalogRow) {
        return `unityCatalog.catalogList.${key}.functions`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function CatalogsTable({
  snapshot
}: {
  snapshot: SnapshotData
}) {
  const snapshotId = snapshot.get('id') as string;

  const catalogNames = snapshot.getIn(['data', 'unityCatalog.catalogNames'], List());
  if (catalogNames.length == 0) {
    return null;
  }

  const rows: CatalogRow[] = catalogNames.toArray().map((catalogKey: string) => {
    const arrKey = catalogKey.split('/');
    return {
      key: catalogKey,
      name: arrKey[0],
      kind: arrKey[1],
      snapshotId
    };
  });

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.azureDatabricks.titleCatalogsCount', {
        count: rows.length
      })}
      cols={cols}
      rows={rows}
    />
  );
}
