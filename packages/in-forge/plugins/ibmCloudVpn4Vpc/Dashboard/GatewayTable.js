/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { bytes, number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.ibmCloudVpn4Vpc.connectionName'),
    type: 'string',
    disableSorting: true,
    typeArgs: {
      getValue(row) {
        return row.name;
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmCloudVpn4Vpc.status'),
    type: 'metric',
    disableSorting: true,
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return `gateway_status`;
      },
      getContent(value) {
        return getStatusText(value);
      },
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmCloudVpn4Vpc.bytesIn'),
    type: 'metric',
    disableSorting: true,
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return `gateway_bytes_in`;
      },
      getContent: bytes.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmCloudVpn4Vpc.bytesOut'),
    type: 'metric',
    disableSorting: true,
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return `gateway_bytes_out`;
      },
      getContent: bytes.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmCloudVpn4Vpc.packetsIn'),
    type: 'metric',
    disableSorting: true,
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return `gateway_packets_in`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmCloudVpn4Vpc.packetsOut'),
    type: 'metric',
    disableSorting: true,
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return `gateway_packets_out`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function GatewayTable({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  const row = [
    {
      key: 'Gateway',
      name: snapshot.get('data').get('vpn_gateway_name'),
      snapshotId,
      timeConfig
    }
  ];

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.ibmCloudVpn4Vpc.titleGateway')}
      cols={cols}
      rows={row}
      getRowDetails={getDetails}
    />
  );
}

function getDetails(row) {
  return (
    <>
      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          max: 1,
          min: 0,
          formatter: statusFormatter,
          metrics: ['gateway_status'],
          labels: [t('in-forge:plugins.ibmCloudVpn4Vpc.status')],
          type: 'line'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          min: 0,
          formatter: bytes.detailed,
          metrics: ['gateway_bytes_in', 'gateway_bytes_out'],
          labels: [t('in-forge:plugins.ibmCloudVpn4Vpc.bytesIn'), t('in-forge:plugins.ibmCloudVpn4Vpc.bytesOut')],
          type: 'line'
        }}
        y2={{
          min: 0,
          formatter: number.compact,
          metrics: ['gateway_packets_in', 'gateway_packets_out'],
          labels: [t('in-forge:plugins.ibmCloudVpn4Vpc.packetsIn'), t('in-forge:plugins.ibmCloudVpn4Vpc.packetsOut')],
          type: 'line'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
    </>
  );
}

function getStatusText(state) {
  switch (state) {
    case 0:
      return t('in-forge:plugins.ibmCloudVpn4Vpc.unavailable');
    case 1:
      return t('in-forge:plugins.ibmCloudVpn4Vpc.available');
    default:
      return t('in-forge:plugins.ibmCloudVpn4Vpc.inProgress');
  }
}

function statusFormatter(value) {
  return value + ': ' + getStatusText(value);
}
