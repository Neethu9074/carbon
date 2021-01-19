/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { zeroDecimalPlaces } from 'in-services/formatters/number';
import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';

const cols = [
  {
    title: 'Name',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  },
  {
    title: 'Protocol',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.protocol;
      }
    }
  },
  {
    title: 'Connections',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `ldap_connectors.data.${row.key}.connection_count`;
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function LdapConnectorsTable({ snapshot, timeConfig }) {
  const data = snapshot.get('data');
  const handlerNames = data.get('ldap_connectors.names', emptyList).sort((a, b) => a.localeCompare(b));
  const handlerStats = data.get('ldap_connector_statistics.names', emptyList).sort((a, b) => a.localeCompare(b));
  const rows = handlerNames.toArray().map((handlerName, i) => {
    const protocol = data.get('ldap_connectors.data.' + handlerName + '.protocol');
    return {
      key: handlerName,
      statsKey: handlerStats.get(i),
      protocol: protocol,
      snapshotId: snapshot.get('id'),
      timeConfig
    };
  });
  if (!rows) {
    return null;
  }
  return (
    <Table
      withoutPadding
      cardTitle={`Ldap Connectors (${rows.length})`}
      cols={cols}
      rows={rows}
      getRowDetails={getRowDetails}
    />
  );
}

function getRowDetails(row) {
  return (
    <div>
      <DashboardSection title="Active Connections">
        <Chart
          snapshotId={row.snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            formatter: zeroDecimalPlaces,
            metrics: ['ldap_connectors.data.' + row.key + '.connection_count'],
            labels: ['Connections'],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="Connection Statistics">
        <Chart
          snapshotId={row.snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            formatter: zeroDecimalPlaces,
            metrics: [
              'ldap_connector_statistics.data.' + row.statsKey + '.add_requests',
              'ldap_connector_statistics.data.' + row.statsKey + '.bind_requests',
              'ldap_connector_statistics.data.' + row.statsKey + '.compare_requests',
              'ldap_connector_statistics.data.' + row.statsKey + '.delete_requests',
              'ldap_connector_statistics.data.' + row.statsKey + '.extended_requests',
              'ldap_connector_statistics.data.' + row.statsKey + '.modify_requests',
              'ldap_connector_statistics.data.' + row.statsKey + '.search_requests'
            ],
            labels: [
              'Add requests',
              'Bind requests',
              'Compare requests',
              'Delete requests',
              'Extended requests',
              'Modify requests',
              'Search requests'
            ],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
    </div>
  );
}
