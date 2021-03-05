/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import { twoDecimalPlaces, bytesTwoDecimalPlaces, percentageTwoDecimalPlaces } from 'in-services/formatters/number';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { getClusterMembers } from 'in-stores/clusterMembers';
import Table from 'in-sdk/components/dashboard/Table';
import { getSnapshots } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';

const cols = [
  {
    title: t('in-forge:plugins.kubernetesCluster.node'),
    type: 'snapshotLink',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
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
      getContent: percentageTwoDecimalPlaces,
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
      getContent: percentageTwoDecimalPlaces,
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
      getContent: percentageTwoDecimalPlaces,
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
      getContent: percentageTwoDecimalPlaces,
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
        return `alloc_pods_percentage`;
      },
      getContent: percentageTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.kubernetesCluster.internalIp'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.internalIp;
      }
    }
  }
];

export default connectTo(
  props => {
    return {
      clusterNodes: getClusterMembers(props.snapshot.get('id')).flatMap(nodeIds => getSnapshots(nodeIds.toArray()))
    };
  },
  function NodesTable({ clusterNodes = [], timeConfig }) {
    const rows = clusterNodes
      .filter(node => node.get('plugin') == 'kubernetesNode')
      .map(node => {
        const data = node.get('data');
        return {
          key: data.get('uid'),
          snapshotId: node.get('id'),
          internalIp: data.get('internalIp'),
          timeConfig
        };
      });

    return (
      <Table
        withoutPadding
        cardTitle={t('in-forge:plugins.kubernetesCluster.nodesWithCount', { len: rows.length })}
        cols={cols}
        rows={rows}
        getRowDetails={getNodeRowDetails}
      />
    );
  }
);

function getNodeRowDetails(row) {
  return (
    <div>
      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          formatter: twoDecimalPlaces,
          metrics: [`required_cpu`, `limit_cpu`, `cap_cpu`],
          labels: [
            t('in-forge:plugins.kubernetesCluster.cpuRequests'),
            t('in-forge:plugins.kubernetesCluster.cpuLimits'),
            t('in-forge:plugins.kubernetesCluster.cpuCapacity')
          ],
          type: 'line'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />

      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          formatter: bytesTwoDecimalPlaces,
          metrics: [`required_mem`, `limit_mem`, `cap_mem`],
          labels: [
            t('in-forge:plugins.kubernetesCluster.memoryRequests'),
            t('in-forge:plugins.kubernetesCluster.memoryLimits'),
            t('in-forge:plugins.kubernetesCluster.memoryCapacity')
          ],
          type: 'line'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
    </div>
  );
}
