/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import ServletsTable from 'in-forge/plugins/jBossAsApplicationContainer/Dashboard/ServletsInDeploymentsTable';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { zeroDecimalPlaces } from 'in-services/formatters/number';
import { yesOrNo } from 'in-services/formatters/boolean';
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
    title: t('in-forge:plugins.jBossAsApplicationContainer.contextRoot'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.deployment.get('contextRoot');
      }
    }
  },
  {
    title: t('in-forge:plugins.jBossAsApplicationContainer.enabled'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return yesOrNo(row.deployment.get('enabled'));
      }
    }
  },
  {
    title: t('in-forge:plugins.jBossAsApplicationContainer.status'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.deployment.get('status');
      }
    }
  },
  {
    title: t('in-forge:plugins.jBossAsApplicationContainer.activeSessions'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return 'sessions.' + row.key + '.activeSessions';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function WebDeploymentsTable({ snapshot, timeConfig }) {
  const deployments = snapshot.getIn(['data', 'deployments'], emptyMap).filter(c => c.get('contextRoot'));
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
      withoutPadding
      cardTitle={t('in-forge:plugins.jBossAsApplicationContainer.webDeploymentsWithCount', { len: rows.length })}
      cols={cols}
      rows={rows}
      getRowDetails={getRowDetails}
    />
  );
}

function getRowDetails(row) {
  return (
    <div>
      <ServletsTable deploymentContext={row.key} snapshot={row.snapshot} timeConfig={row.timeConfig} />

      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          metrics: ['sessions.' + row.key + '.activeSessions'],
          labels: [t('in-forge:plugins.jBossAsApplicationContainer.activeSessions')],
          type: 'line',
          min: 0
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
    </div>
  );
}
