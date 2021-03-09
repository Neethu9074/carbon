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
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.pingDirectory.dashboard.name'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  },
  {
    title: t('in-forge:plugins.pingDirectory.dashboard.protocol'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.protocol;
      }
    }
  },
  {
    title: t('in-forge:plugins.pingDirectory.dashboard.connections'),
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
      cardTitle={t('in-forge:plugins.pingDirectory.dashboard.ldapConnectorsWithCount', {
        count: rows.length
      })}
      cols={cols}
      rows={rows}
      getRowDetails={getRowDetails}
    />
  );
}

function getRowDetails(row) {
  return (
    <div>
      <DashboardSection title={t('in-forge:plugins.pingDirectory.dashboard.activeConnections')}>
        <Chart
          snapshotId={row.snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            formatter: zeroDecimalPlaces,
            metrics: ['ldap_connectors.data.' + row.key + '.connection_count'],
            labels: [t('in-forge:plugins.pingDirectory.dashboard.connections')],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.pingDirectory.dashboard.connectionStatistics')}>
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
              t('in-forge:plugins.pingDirectory.dashboard.addRequests'),
              t('in-forge:plugins.pingDirectory.dashboard.bindRequests'),
              t('in-forge:plugins.pingDirectory.dashboard.compareRequests'),
              t('in-forge:plugins.pingDirectory.dashboard.deleteRequests'),
              t('in-forge:plugins.pingDirectory.dashboard.extendedRequests'),
              t('in-forge:plugins.pingDirectory.dashboard.modifyRequests'),
              t('in-forge:plugins.pingDirectory.dashboard.searchRequests')
            ],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
    </div>
  );
}
