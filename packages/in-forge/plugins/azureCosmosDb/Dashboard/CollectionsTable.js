/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import Collection from 'in-forge/plugins/azureCosmosDb/Dashboard/Collection';
import { emptyList } from 'in-services/fixedImmutables';
import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.azureCosmosDB.dashboard.titleCollection'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.name;
      }
    }
  },
  {
    title: t('in-forge:plugins.azureCosmosDB.dashboard.labelTr'),
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `metrics.collections.${row.key}.tr`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.azureCosmosDB.dashboard.labelDc'),
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `metrics.collections.${row.key}.dc`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function CollectionsTable({
  snapshot,
  timeConfig,
  region,
  database,
  collections,
  statusCodes,
  resourceTypes
}) {
  const snapshotId = snapshot.get('id');

  var rows = emptyList;
  collections.map(coll => {
    if (coll.startsWith(database == null ? region : database)) {
      rows = rows.push({
        key: coll,
        name: snapshot.getIn(['data', 'meta.collections.' + coll]),
        snapshotId: snapshotId,
        snapshot: snapshot,
        timeConfig: timeConfig
      });
    }
  });

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.azureCosmosDB.dashboard.titleCollectionCount', { collectionCount: rows.size })}
      cols={cols}
      rows={rows.toArray()}
      getRowDetails={getRowDetails}
    />
  );

  function getRowDetails(row) {
    return (
      <Collection
        snapshot={snapshot}
        timeConfig={timeConfig}
        collection={row.key}
        statusCodes={statusCodes}
        resourceTypes={resourceTypes}
      />
    );
  }
}
