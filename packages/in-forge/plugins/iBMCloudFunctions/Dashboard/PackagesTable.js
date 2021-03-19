/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { number, timeByMillisFourDecimalPlaces } from 'in-services/formatters/number';
import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.iBMCloudFunctions.titleAction'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.name;
      }
    }
  },
  {
    title: t('in-forge:plugins.iBMCloudFunctions.titleActivation'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `packages.${row.pkgName}.${row.name}.activation`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.iBMCloudFunctions.titleDuration'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `packages.${row.pkgName}.${row.name}.duration`;
      },
      getContent: timeByMillisFourDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.iBMCloudFunctions.titleStatusSuccess'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `packages.${row.pkgName}.${row.name}.status-success`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.iBMCloudFunctions.titleWaitTime'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `packages.${row.pkgName}.${row.name}.wait-time`;
      },
      getContent: timeByMillisFourDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.iBMCloudFunctions.titleInitTime'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `packages.${row.pkgName}.${row.name}.initTime`;
      },
      getContent: timeByMillisFourDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

function getTableRows(pkgName, pkg, snapshot, timeConfig) {
  const snapshotId = snapshot.get('id');
  return pkg.toArray().map(name => ({ key: name, pkgName, name, snapshotId, timeConfig }));
}

function getTable(pkgName, pkg, snapshot, timeConfig) {
  return (
    <Table
      withoutPadding
      cardTitle={pkgName}
      key={pkgName}
      cols={cols}
      rows={getTableRows(pkgName, pkg, snapshot, timeConfig)}
      maxItemsPerPage={20}
    />
  );
}

export default function PackagesTable({ snapshot, timeConfig }) {
  const pkgs = snapshot.getIn(['data', 'packages'], emptyList);

  if (pkgs.length == 0) {
    return null;
  }

  const pkgNames = Array.from(pkgs.keys());

  return pkgNames.map(name => getTable(name, pkgs.get(name), snapshot, timeConfig));
}
