/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { bytes, number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { getRawPayload } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.ibmCloudVpn4Vpc.connectionName'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.name;
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmCloudVpn4Vpc.status'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `vpn_connections.${row.name}.connection_status`;
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
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `vpn_connections.${row.name}.connection_bytes_in`;
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
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `vpn_connections.${row.name}.connection_bytes_out`;
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
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `vpn_connections.${row.name}.connection_packets_in`;
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
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `vpn_connections.${row.name}.connection_packets_out`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default connectTo(
  props => {
    return {
      connectionNames: getRawPayload(props.snapshot.get('id'), 'vpn_connections')
    };
  },
  function ConnectionsTable({ snapshot, timeConfig, connectionNames }) {
    if (!connectionNames || connectionNames.isEmpty()) {
      return null;
    }

    const rows = connectionNames.toArray().map(connName => {
      return {
        key: connName,
        name: connName,
        snapshotId: snapshot.get('id'),
        timeConfig
      };
    });
    if (rows.length === 0) {
      return null;
    }
    return (
      <Table
        withoutPadding
        cardTitle={t('in-forge:plugins.ibmCloudVpn4Vpc.titleConnections')}
        cols={cols}
        rows={rows}
        getRowDetails={getDetails}
        maxItemsPerPage={10}
      />
    );
  }
);

function getDetails(row) {
  return (
    <>
      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          max: 1,
          min: 0,
          formatter: number.compact,
          metrics: ['vpn_connections.' + row.name + '.connection_status'],
          labels: [t('in-forge:plugins.ibmCloudVpn4Vpc.connectionStatus')],
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
          metrics: [
            'vpn_connections.' + row.name + '.connection_bytes_in',
            'vpn_connections.' + row.name + '.connection_bytes_out'
          ],
          labels: [t('in-forge:plugins.ibmCloudVpn4Vpc.bytesIn'), t('in-forge:plugins.ibmCloudVpn4Vpc.bytesOut')],
          type: 'line'
        }}
        y2={{
          min: 0,
          formatter: number.compact,
          metrics: [
            'vpn_connections.' + row.name + '.connection_packets_in',
            'vpn_connections.' + row.name + '.connection_packets_out'
          ],
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
      return t('in-forge:plugins.ibmCloudVpn4Vpc.down');
    case 1:
      return t('in-forge:plugins.ibmCloudVpn4Vpc.up');
    default:
      return t('in-forge:plugins.ibmCloudVpn4Vpc.inProgress');
  }
}
