/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { number, millis } from 'in-services/formatters/number';
import { emptyMap } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.jBossAsApplicationContainer.datasourceJndiName'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  },
  {
    title: t('in-forge:plugins.jBossAsApplicationContainer.activeConnections'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'datasources.metrics.' + row.key + '.active';
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.jBossAsApplicationContainer.availableConnections'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'datasources.metrics.' + row.key + '.available';
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.jBossAsApplicationContainer.connectionsCurrentlyInUse'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'datasources.metrics.' + row.key + '.inUse';
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.jBossAsApplicationContainer.timeWaitedForExclusiveLockOnPool'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'datasources.metrics.' + row.key + '.blockingTime';
      },
      getContent: millis.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function DatasourcesTable({ snapshot, timeConfig }) {
  const datasources = snapshot.getIn(['data', 'datasources.snapshot'], emptyMap);
  if (datasources.size === 0) {
    return null;
  }

  const rows = datasources
    .keySeq()
    .toArray()
    .map(key => {
      const datasource = datasources.get(key);
      return {
        key,
        timeConfig,
        snapshotId: snapshot.get('id'),
        datasource
      };
    });

  return (
    <Table
      cardTitle={t('in-forge:plugins.jBossAsApplicationContainer.datasourceConnectionPoolsWithCount', {
        len: rows.length
      })}
      cols={cols}
      rows={rows}
      getRowDetails={getRowDetails}
      withoutPadding
    />
  );
}

function getRowDetails(row) {
  return (
    <div>
      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          formatter: number.detailed,
          metrics: [
            'datasources.metrics.' + row.key + '.active',
            'datasources.metrics.' + row.key + '.available',
            'datasources.metrics.' + row.key + '.inUse',
            'datasources.metrics.' + row.key + '.created',
            'datasources.metrics.' + row.key + '.timedOut'
          ],
          labels: [
            t('in-forge:plugins.jBossAsApplicationContainer.active'),
            t('in-forge:plugins.jBossAsApplicationContainer.available'),
            t('in-forge:plugins.jBossAsApplicationContainer.inUse'),
            t('in-forge:plugins.jBossAsApplicationContainer.created'),
            t('in-forge:plugins.jBossAsApplicationContainer.timedOut')
          ],
          type: 'line'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          formatter: millis.detailed,
          metrics: [
            'datasources.metrics.' + row.key + '.blockingTime',
            'datasources.metrics.' + row.key + '.creationTime'
          ],
          labels: [
            t('in-forge:plugins.jBossAsApplicationContainer.timeWaitedForExclusiveLockOnPool'),
            t('in-forge:plugins.jBossAsApplicationContainer.timeSpentOnCreatingConnections')
          ],
          type: 'line'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
    </div>
  );
}
