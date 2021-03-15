/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { emptyMap } from 'in-services/fixedImmutables';
import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

// Tomcat 6 which does not have connection infos
const colsWithoutConnections = [
  {
    title: t('in-forge:plugins.tomcatAppContainer.titleConnector'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  },
  {
    title: t('in-forge:plugins.tomcatAppContainer.titleThreads'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `connectors.${row.key}.threads`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.tomcatAppContainer.titleBusyThreads'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `connectors.${row.key}.threadsBusy`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.tomcatAppContainer.titleMaxThreads'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.connector.getIn(['threads', 'max']);
      },
      getContent: number.compact
    }
  }
];

const colsWithConnections = [
  ...colsWithoutConnections,
  {
    title: t('in-forge:plugins.tomcatAppContainer.titleConnectionCount'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `connectors.${row.key}.connections`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.tomcatAppContainer.titleMaxConnections'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.connector.getIn(['connections', 'max']);
      },
      getContent: number.compact
    }
  }
];

export default function ConnectorsTable({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  const rows = snapshot
    .getIn(['data', 'connector-config'], emptyMap)
    .filter(c => !c.get('executor'))
    .map((connector, name) => {
      return {
        key: name,
        connector,
        snapshotId,
        timeConfig
      };
    })
    .valueSeq()
    .toArray();

  if (rows.length === 0) {
    return null;
  }

  let cols = colsWithoutConnections;
  let getRowDetails = createDetailsWithoutConnections;
  if (rows[0].connector.get('connections')) {
    cols = colsWithConnections;
    getRowDetails = createDetailsWithConnections;
  }

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.tomcatAppContainer.titleConnectorsCount', { count: rows.length })}
      cols={cols}
      rows={rows}
      getRowDetails={getRowDetails}
    />
  );
}

function createDetailsWithConnections(row) {
  return (
    <Chart
      snapshotId={row.snapshotId}
      timeConfig={row.timeConfig}
      y1={{
        metrics: [
          'connectors.' + row.key + '.threads',
          'connectors.' + row.key + '.threadsBusy',
          'connectors.' + row.key + '.connections'
        ],
        labels: [
          t('in-forge:plugins.tomcatAppContainer.labelCountThreads', { count: row.key }),
          t('in-forge:plugins.tomcatAppContainer.labelCountBusyThreads', { count: row.key }),
          t('in-forge:plugins.tomcatAppContainer.labelCountConnections', { count: row.key })
        ],
        type: 'line'
      }}
      renderPostChartContent={PluginDashboardsMarkerLanes}
    />
  );
}

function createDetailsWithoutConnections(row) {
  return (
    <Chart
      snapshotId={row.snapshotId}
      timeConfig={row.timeConfig}
      y1={{
        metrics: ['connectors.' + row.key + '.threads', 'connectors.' + row.key + '.threadsBusy'],
        labels: [
          t('in-forge:plugins.tomcatAppContainer.labelCountThreads', { count: row.key }),
          t('in-forge:plugins.tomcatAppContainer.labelCountBusyThreads', { count: row.key })
        ],
        type: 'line'
      }}
      renderPostChartContent={PluginDashboardsMarkerLanes}
    />
  );
}
