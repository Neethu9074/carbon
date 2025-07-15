/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import { number } from 'in-services/formatters/number';
import { emptyMap } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

const colsWithVirtualThreadConf = [
  {
    title: t('in-forge:plugins.tomcatAppContainer.titleVirtConnector'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  },
  {
    title: t('in-forge:plugins.tomcatAppContainer.titleVirtThreads'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `connectors.${row.key}.virtualThreadCount`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function VirtualThreadTable({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  const rows = snapshot
    .getIn(['data', 'connector-config'], emptyMap)
    .filter(c => !c.get('executor'))
    .filter(c => c.get('threadtype') === 'Virtual')
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

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.tomcatAppContainer.titleVirtualConnectorsCount', { len: rows.length })}
      cols={colsWithVirtualThreadConf}
      rows={rows}
      getRowDetails={getRowDetails}
    />
  );
}

function getRowDetails(row) {
  return (
    <Chart
      snapshotId={row.snapshotId}
      timeConfig={row.timeConfig}
      y1={{
        metrics: ['connectors.' + row.key + '.virtualThreadCount'],
        labels: [t('in-forge:plugins.tomcatAppContainer.labelCountVirtualThreads', { count: row.key })],
        type: 'line'
      }}
      renderPostChartContent={PluginDashboardsMarkerLanes}
    />
  );
}
