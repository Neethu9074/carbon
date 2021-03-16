/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { seconds } from 'in-services/formatters/number';
import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';

const cols = [
  {
    title: 'Action',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.name;
      }
    }
  },
  {
    title: 'Activation',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `packages.${row.pkgName}.${row.name}.activation`;
      },
      getContent: seconds.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Duration',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `packages.${row.pkgName}.${row.name}.duration`;
      },
      getContent: seconds.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Status Success',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `packages.${row.pkgName}.${row.name}.status-success`;
      },
      getContent: seconds.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

function getTableRows(pkg, snapshot, timeConfig) {
  const pkgName = pkg.name;
  const snapshotId = snapshot.get('Id');
  return pkg.actions.map(act => ({
    key: act.name,
    pkgName: pkgName,
    name: act.name,
    snapshotId: snapshotId,
    timeConfig: timeConfig
  }));
}

function getTable(pkg, snapshot, timeConfig) {
  return (
    <Table
      withoutPadding
      cardTitle={pkg.name}
      cols={cols}
      rows={getTableRows(pkg, snapshot, timeConfig)}
      maxItemsPerPage={20}
    />
  );
}

export default function PackagesTable({ snapshot, timeConfig }) {
  const pkgs = snapshot.getIn(['data', 'packages'], emptyList);
  if (pkgs.length == 0) {
    return null;
  }

  return pkgs.map(obj => getTable(obj, snapshot, timeConfig));
}
