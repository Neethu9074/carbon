/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import Database from 'in-forge/plugins/azureCosmosDb/Dashboard/Database';
import { emptyList } from 'in-services/fixedImmutables';
import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';

const cols = [
  {
    title: 'Database',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.name;
      }
    }
  },
  {
    title: 'Total Requests',
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
    title: 'Metadata Requests',
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
    title: 'Document Count',
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
      cardTitle={`Databases (${rows.size})`}
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
