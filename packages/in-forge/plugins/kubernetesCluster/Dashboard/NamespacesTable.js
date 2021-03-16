/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import {
  resourceQuotaPercentage,
  resourceQuotaBytes,
  resourceQuotaTwoDecimalPlaces
} from '../formatters/resourceQuota';
import createNamespacesForClusterSubscription from 'in-subscription/namespacesForCluster';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import Columize from 'in-sdk/components/dashboard/Columize';
import Table from 'in-sdk/components/dashboard/Table';
import { getSnapshots } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.kubernetesCluster.name'),
    type: 'snapshotLink',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      }
    }
  },
  {
    title: t('in-forge:plugins.kubernetesCluster.status'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.status;
      }
    }
  },
  {
    title: t('in-forge:plugins.kubernetesCluster.cpuRequestsAllocation'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return `required_cpu_percentage`;
      },
      getContent: resourceQuotaPercentage,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.kubernetesCluster.cpuLimitsAllocation'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return `limit_cpu_percentage`;
      },
      getContent: resourceQuotaPercentage,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.kubernetesCluster.memoryRequestsAllocation'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return `required_mem_percentage`;
      },
      getContent: resourceQuotaPercentage,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.kubernetesCluster.memoryLimitsAllocation'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return `limit_mem_percentage`;
      },
      getContent: resourceQuotaPercentage,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.kubernetesCluster.podsAllocation'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return `used_pods_percentage`;
      },
      getContent: resourceQuotaPercentage,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default connectTo(
  props => ({
    namespaceSnapshots: createNamespacesForClusterSubscription({
      snapshotId: props.snapshot.get('id'),
      timeConfig: props.timeConfig
    }).flatMap(getSnapshots)
  }),

  function NamespacesTable({ namespaceSnapshots, timeConfig }) {
    let rows = [];

    if (namespaceSnapshots) {
      rows = namespaceSnapshots.map(namespaceSnapshot => ({
        key: namespaceSnapshot.get('id'),
        snapshotId: namespaceSnapshot.get('id'),
        name: namespaceSnapshot.getIn(['data', 'name']),
        status: namespaceSnapshot.getIn(['data', 'status']),
        timeConfig
      }));
    }

    return (
      <Table
        withoutPadding
        cardTitle={t('in-forge:plugins.kubernetesCluster.namespacesWithCount', { len: rows.length })}
        cols={cols}
        rows={rows}
        getRowDetails={getNamespaceRowDetails}
      />
    );
  }
);

function getNamespaceRowDetails(row) {
  return (
    <div>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.kubernetesCluster.cpuRequestsLimits')}>
          <Chart
            snapshotId={row.snapshotId}
            timeConfig={row.timeConfig}
            y1={{
              formatter: resourceQuotaTwoDecimalPlaces,
              metrics: [`cap_requests_cpu`, `used_requests_cpu`, `cap_limits_cpu`, `used_limits_cpu`],
              labels: [
                t('in-forge:plugins.kubernetesCluster.capacityRequests'),
                t('in-forge:plugins.kubernetesCluster.usedRequests'),
                t('in-forge:plugins.kubernetesCluster.capacityLimits'),
                t('in-forge:plugins.kubernetesCluster.usedLimits')
              ],
              type: 'line',
              min: 0
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>

        <DashboardSection title={t('in-forge:plugins.kubernetesCluster.memoryRequestsLimits')}>
          <Chart
            snapshotId={row.snapshotId}
            timeConfig={row.timeConfig}
            y1={{
              formatter: resourceQuotaBytes,
              metrics: [`cap_requests_memory`, `used_requests_memory`, `cap_limits_memory`, `used_limits_memory`],
              labels: [
                t('in-forge:plugins.kubernetesCluster.capacityRequests'),
                t('in-forge:plugins.kubernetesCluster.usedRequests'),
                t('in-forge:plugins.kubernetesCluster.capacityLimits'),
                t('in-forge:plugins.kubernetesCluster.usedLimits')
              ],
              type: 'line',
              min: 0
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
    </div>
  );
}
