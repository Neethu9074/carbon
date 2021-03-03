/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import { zeroDecimalPlaces, number } from 'in-services/formatters/number';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { emptyMap } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';

const cols = [
  {
    title: t('in-forge:plugins.jBossAsApplicationContainer.deployment'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  },
  {
    title: t('in-forge:plugins.jBossAsApplicationContainer.pool'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.deployment.get('pool');
      }
    }
  },
  {
    title: t('in-forge:plugins.jBossAsApplicationContainer.poolSize'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.deployment.get('poolSize');
      },
      getContent: number.compact
    }
  },
  {
    title: t('in-forge:plugins.jBossAsApplicationContainer.poolAvailable'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'ejbs.' + row.key + '.poolAvailable';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function EjbDeploymentsTable({ snapshot, timeConfig }) {
  const deployments = snapshot.getIn(['data', 'ejbDeployments'], emptyMap);
  if (deployments.size === 0) {
    return null;
  }

  const rows = deployments
    .keySeq()
    .toArray()
    .map(key => {
      const deployment = deployments.get(key);
      return {
        key,
        timeConfig,
        snapshotId: snapshot.get('id'),
        snapshot: snapshot,
        deployment
      };
    });

  return (
    <Table
      cardTitle={t('in-forge:plugins.jBossAsApplicationContainer.ejbDeploymentsWithCount', { len: rows.length })}
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
          metrics: ['ejbs.' + row.key + '.poolAvailable'],
          labels: [t('in-forge:plugins.jBossAsApplicationContainer.available')],
          type: 'line',
          min: 0
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
    </div>
  );
}
