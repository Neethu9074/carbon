/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import Database from 'in-forge/plugins/azureCosmosDb/Dashboard/Database';
import { emptyList } from 'in-services/fixedImmutables';
import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';

const cols = [
  {
    title: t('in-forge:plugins.azureCosmosDB.dashboard.titleDatabase'),
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
        return `metrics.databases.${row.key}.tr`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.azureCosmosDB.dashboard.labelMr'),
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `metrics.databases.${row.key}.mr`;
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
        return `metrics.databases.${row.key}.dc`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function DatabaseTable({
  snapshot,
  timeConfig,
  region,
  databases,
  collections,
  statusCodes,
  resourceTypes
}) {
  const snapshotId = snapshot.get('id');

  var rows = emptyList;
  databases.map(coll => {
    if (coll.startsWith(region)) {
      rows = rows.push({
        key: coll,
        name: snapshot.getIn(['data', 'meta.databases.' + coll]),
        snapshotId: snapshotId,
        snapshot: snapshot,
        timeConfig: timeConfig
      });
    }
  });

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.azureCosmosDB.dashboard.titleDatabaseCount', { databaseCount: rows.size })}
      cols={cols}
      rows={rows.toArray()}
      getRowDetails={getRowDetails}
    />
  );

  function getRowDetails(row) {
    return (
      <Database
        snapshot={snapshot}
        timeConfig={timeConfig}
        region={region}
        database={row.key}
        collections={collections}
        statusCodes={statusCodes}
        resourceTypes={resourceTypes}
      />
    );
  }
}
