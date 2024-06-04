/*
 * (c) Copyright IBM Corp. 2024
 * (c) Copyright Instana Inc.
 */

import { List } from 'immutable';
import React from 'react';

import { WINDOW_FOR_LATEST_METRIC, DISTANCE_BETWEEN_DATAPOINTS } from 'in-forge/plugins/oTelJvm/constants';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import TableExplanation from 'in-sdk/components/dashboard/TableExplanation';
import { bytesTwoDecimalPlaces } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { t, Trans } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.oTelJvm.dashboard.pool'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.name;
      }
    }
  },
  {
    title: t('in-forge:plugins.oTelJvm.dashboard.maximum'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `jvm.memory.max_${row.key}`;
      },
      getContent: formatMax,
      getTimeWindowAggregation() {
        return 'mean';
      },
      getWindowForLatest() {
        return WINDOW_FOR_LATEST_METRIC;
      }
    }
  },
  {
    title: t('in-forge:plugins.oTelJvm.dashboard.value'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `jvm.memory.used_${row.key}`;
      },
      getContent: bytesTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      },
      getWindowForLatest() {
        return WINDOW_FOR_LATEST_METRIC;
      }
    }
  }
];

export default function OTelMemoryPoolsTable({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  const paths = ['jvm.memory.max', 'jvm.memory.used'];
  let rows = [];
  const uniqueKeys = new Set();
  for (const path of paths) {
    const data = snapshot.getIn(['data', path], List());
    if (data.size > 0) {
      rows = data
        .map((value, key) => {
          if (!uniqueKeys.has(key)) {
            uniqueKeys.add(key);
            return {
              key: key,
              name: key,
              timeConfig,
              snapshotId
            };
          }
          return null;
        })
        .filter(Boolean)
        .valueSeq()
        .toArray();

      break;
    }
  }

  const explanation = (
    <TableExplanation>
      <Trans i18nKey="in-forge:plugins.oTelJvm.dashboard.notAllMemoryPoolsAreConsideredToBePartOfTheJvmHeap" />
    </TableExplanation>
  );

  return (
    <Table
      cardTitle={t('in-forge:plugins.oTelJvm.dashboard.memoryPools')}
      withoutPadding
      cols={cols}
      rows={rows}
      getRowDetails={row => getDetails(row, snapshot)}
      explanation={explanation}
    />
  );
}

function formatMax(bytes) {
  return bytes === -1 ? t('in-forge:plugins.oTelJvm.dashboard.unlimited') : bytesTwoDecimalPlaces(bytes);
}

function getDetails(row, snapshot) {
  const metrics = ['jvm.memory.used_' + row.name, 'jvm.memory.max_' + row.name];

  const labels = [t('in-forge:plugins.oTelJvm.dashboard.used'), t('in-forge:plugins.oTelJvm.dashboard.maximum')];

  const adjustedMetrics = metrics.map(metric => {
    const value = getMetricValue(snapshot, metric);
    if (metric.includes('jvm.memory.max') && value === -1) {
      return t('in-forge:plugins.oTelJvm.dashboard.unlimited');
    }
    return metric;
  });
  return (
    <Chart
      distanceBetweenDatapointsInMillis={DISTANCE_BETWEEN_DATAPOINTS}
      snapshotId={row.snapshotId}
      timeConfig={row.timeConfig}
      y1={{
        metrics: adjustedMetrics,
        labels: labels,
        type: 'line',
        formatter: bytesTwoDecimalPlaces
      }}
      renderPostChartContent={PluginDashboardsMarkerLanes}
    />
  );
}

function getMetricValue(snapshot, metric) {
  const [type, name] = metric.split('_');
  const data = snapshot.getIn(['data', type], List());
  return data.has(name) ? data.get(name) : null;
}
