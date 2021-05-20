/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { millis, number } from 'in-services/formatters/number';
import Columize from 'in-sdk/components/dashboard/Columize';
import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.ibmCloudFunctions.titleAction'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.name;
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmCloudFunctions.titleActivation'),
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
    title: t('in-forge:plugins.ibmCloudFunctions.titleStatusSuccess'),
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
    title: t('in-forge:plugins.ibmCloudFunctions.timedRateLimit'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `packages.${row.pkgName}.${row.name}.timed-rate-limit`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmCloudFunctions.titleDuration'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `packages.${row.pkgName}.${row.name}.duration`;
      },
      getContent: millis.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmCloudFunctions.titleWaitTime'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `packages.${row.pkgName}.${row.name}.wait-time`;
      },
      getContent: millis.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmCloudFunctions.titleInitTime'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `packages.${row.pkgName}.${row.name}.initTime`;
      },
      getContent: millis.detailed,
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
      getRowDetails={getDetails}
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

function getDetails(row) {
  return (
    <Columize>
      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          min: 0,
          formatter: number.compact,
          metrics: [
            'packages.' + row.pkgName + '.' + row.name + '.activation',
            'packages.' + row.pkgName + '.' + row.name + '.status-success',
            'packages.' + row.pkgName + '.' + row.name + '.timed-rate-limit'
          ],
          labels: [
            t('in-forge:plugins.ibmCloudFunctions.titleActivation'),
            t('in-forge:plugins.ibmCloudFunctions.titleStatusSuccess'),
            t('in-forge:plugins.ibmCloudFunctions.timedRateLimit')
          ],
          type: 'line'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          min: 0,
          formatter: millis.detailed,
          metrics: [
            'packages.' + row.pkgName + '.' + row.name + '.initTime',
            'packages.' + row.pkgName + '.' + row.name + '.duration',
            'packages.' + row.pkgName + '.' + row.name + '.wait-time'
          ],
          labels: [
            t('in-forge:plugins.ibmCloudFunctions.titleInitTime'),
            t('in-forge:plugins.ibmCloudFunctions.titleDuration'),
            t('in-forge:plugins.ibmCloudFunctions.titleWaitTime')
          ],
          type: 'line'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
    </Columize>
  );
}
