/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { List } from 'immutable';
import React from 'react';

import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

interface PopAssetRow {
  key: string;
  name: string;
  type: string;
  snapshotId: string;
}

const cols = [
  {
    title: t('in-forge:plugins.azureDatabricks.labelAssetName'),
    type: 'string',
    typeArgs: {
      getValue({ name }: PopAssetRow) {
        return name;
      }
    }
  },
  {
    title: t('in-forge:plugins.azureDatabricks.labelAssetType'),
    type: 'string',
    typeArgs: {
      getValue({ type }: PopAssetRow) {
        return type;
      }
    }
  },
  {
    title: t('in-forge:plugins.azureDatabricks.labelNumberOfAccess'),
    type: 'metric',
    typeArgs: {
      getSnapshotId({ snapshotId }: PopAssetRow) {
        return snapshotId;
      },
      getMetricName({ key }: PopAssetRow) {
        return `unityCatalog.popAssets.${key}`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function PopularAssetsTable({
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

  const popAssetsIds = snapshot.getIn(['data', 'unityCatalog.popAssetsIds'], List());
  if (popAssetsIds.length == 0) {
    return null;
  }

  const rows: PopAssetRow[] = popAssetsIds.toArray().map((popAssetKey: string) => {
    const arrKey = popAssetKey.split('/');
    return {
      key: popAssetKey,
      name: arrKey[0],
      type: arrKey[1],
      snapshotId
    };
  });

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.azureDatabricks.titlePopAssetsCount', {
        count: rows.length
      })}
      cols={cols}
      rows={rows}
      initialSortDirection="desc"
      initialSortColumn={2}
    />
  );
}
