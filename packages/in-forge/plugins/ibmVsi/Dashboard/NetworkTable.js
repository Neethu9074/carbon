/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { bytes, number } from 'in-services/formatters/number';
import Columize from 'in-sdk/components/dashboard/Columize';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

const cols = [
  {
    id: 'direction',
    title: t('in-forge:plugins.ibmVsi.direction'),
    type: 'string',
    disableSorting: true,
    typeArgs: {
      getValue(row) {
        return row.title;
      }
    }
  },
  {
    id: 'bytes',
    title: t('in-forge:plugins.ibmVsi.bytes'),
    type: 'sparkChart',
    disableSorting: true,
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `network.network_` + row.type + `_bytes`;
      },
      getContent: bytes.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    id: 'errors',
    title: t('in-forge:plugins.ibmVsi.errors'),
    type: 'metric',
    disableSorting: true,
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `network.network_` + row.type + `_errors`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    id: 'packets',
    title: t('in-forge:plugins.ibmVsi.packets'),
    type: 'sparkChart',
    disableSorting: true,
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `network.network_` + row.type + `_packets`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    id: 'packetsDropped',
    title: t('in-forge:plugins.ibmVsi.packetsDropped'),
    type: 'metric',
    disableSorting: true,
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `network.network_` + row.type + `_dropped_packets`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function NetworkTable({ snapshot, timeConfig }) {
  const row = [
    {
      key: 'in',
      type: 'in',
      title: 'Received',
      timeConfig,
      snapshotId: snapshot.get('id')
    },
    {
      key: 'out',
      type: 'out',
      title: 'Sent',
      timeConfig,
      snapshotId: snapshot.get('id')
    }
  ];

  return (
    <Table
      cardTitle={t('in-forge:plugins.ibmVsi.network')}
      withoutPadding
      cols={cols}
      rows={row}
      getRowDetails={getRowDetails}
    />
  );
}

function getRowDetails(row) {
  return (
    <Columize>
      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          min: 0,
          formatter: bytes.detailed,
          metrics: ['network.network_' + row.type + '_bytes'],
          labels: [t('in-forge:plugins.ibmVsi.bytes')],
          type: 'line'
        }}
        y2={{
          min: 0,
          formatter: number.compact,
          tooltipFormatter: number.compact,
          metrics: ['network.network_' + row.type + '_errors'],
          labels: [t('in-forge:plugins.ibmVsi.errors')],
          type: 'line'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          min: 0,
          formatter: number.compact,
          metrics: ['network.network_' + row.type + '_packets'],
          labels: [t('in-forge:plugins.ibmVsi.packets')],
          type: 'line'
        }}
        y2={{
          min: 0,
          formatter: number.compact,
          tooltipFormatter: number.compact,
          metrics: ['network.network_' + row.type + '_dropped_packets'],
          labels: [t('in-forge:plugins.ibmVsi.packetsDropped')],
          type: 'line'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
    </Columize>
  );
}
