/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { emptyList } from 'in-services/fixedImmutables';
import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

const cols = [
  {
    id: 'name',
    title: t('in-forge:plugins.instanaAgent.dashboard.name'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  },
  {
    id: 'value',
    title: t('in-forge:plugins.instanaAgent.dashboard.count'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `log.counts.byMessage.${row.value}`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'sum';
      },
      forceTimeWindowAggregation: true
    }
  }
];

export default function LogMetrics({ snapshot, timeConfig }) {
  const rows = snapshot
    .getIn(['data', 'log.counts.byMessage'], emptyList)
    .map((key, value) => {
      return {
        key: key,
        value: value,
        snapshotId: snapshot.get('id'),
        timeConfig
      };
    })
    .toArray();

  return (
    <Table
      cardTitle={t('in-forge:plugins.instanaAgent.dashboard.logCounts')}
      withoutPadding
      cols={cols}
      rows={rows}
      getRowDetails={getRowDetails}
      maxItemsPerPage={10}
    />
  );
}

function getRowDetails(row) {
  return (
    <Chart
      snapshotId={row.snapshotId}
      timeConfig={row.timeConfig}
      y1={{
        min: 0,
        formatter: number.compact,
        metrics: ['log.counts.byMessage.' + row.value],
        labels: [t('in-forge:plugins.instanaAgent.dashboard.count')],
        type: 'line'
      }}
      renderPostChartContent={PluginDashboardsMarkerLanes}
    />
  );
}
