/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import { withSiPrefixZeroDecimalPlaces } from 'in-services/formatters/number';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

const metrics = [
  'nomad.nomad.heartbeat.active',
  'nomad.nomad.plan.queue_depth',
  'nomad.nomad.vault.distributed_tokens_revoking',
  'nomad.runtime.alloc_bytes',
  'nomad.runtime.free_count',
  'nomad.runtime.heap_objects',
  'nomad.runtime.malloc_count',
  'nomad.runtime.sys_bytes',
  'nomad.runtime.total_gc_pause_ns',
  'nomad.runtime.total_gc_runs',
  'nomad.runtime.num_goroutines'
];

const cols = [
  {
    title: t('in-forge:plugins.nomadScheduler.name'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.name;
      }
    }
  },
  {
    title: t('in-forge:plugins.nomadScheduler.value'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `${row.name}`;
      },
      getContent: withSiPrefixZeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function Gauges({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  const rows = metrics.map(name => {
    return {
      key: name,
      name,
      snapshotId,
      timeConfig
    };
  });

  if (rows.length === 0) {
    return null;
  }

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.nomadScheduler.gaugesWithCount', { len: rows.length })}
      cols={cols}
      rows={rows}
      getRowDetails={getDetails}
      maxItemsPerPage={100}
    />
  );
}

function getDetails(row) {
  return (
    <Chart
      snapshotId={row.snapshotId}
      timeConfig={row.timeConfig}
      margins={{
        left: 90
      }}
      y1={{
        formatter: withSiPrefixZeroDecimalPlaces,
        metrics: [row.name],
        labels: [row.name],
        type: 'line'
      }}
      renderPostChartContent={PluginDashboardsMarkerLanes}
    />
  );
}
