import { get } from 'lodash';
import React from 'react';

import KubernetesEntityHealthIndicatorBehavior from 'in-kubernetes/components/KubernetesEntityHealthIndicatorBehavior';
import ServerTableWithUrlBoundState from 'in-components/tables/ServerTable/ServerTableWithUrlBoundState';
import SeverityAwareEntityLink from 'in-components/tables/sharedComponents/SeverityAwareEntityLink';
import HealthIndicatorPresenter from 'in-new-components/health/HealthIndicatorPresenter';
import getKubernetesNodes from 'in-subscription/kubernetes/getKubernetesNodes';
import { percentageTwoDecimalPlaces } from 'in-services/formatters/number';
import { getNodeDashboard } from 'in-kubernetes/navigation/paths';
import MetricValue from 'in-components/MetricValue';

const pathSegment = '/nodes';
const matrixPrefix = 'node.';

export default function Services({ timeConfig, clusterId }) {
  return (
    <ServerTableWithUrlBoundState
      cardTitle="Nodes"
      pathSegment={pathSegment}
      matrixPrefix={matrixPrefix}
      get={getTableData}
      columnDefinitions={columnDefinitions}
      timeConfig={timeConfig}
      clusterId={clusterId}
      paginationResettingProps={['clusterId', 'timeConfig']}
      defaultOrderBy="name"
      defaultOrderDirection="ASC"
    />
  );
}

function getTableData({ query, page, pageSize, orderBy, orderDirection, timeConfig, clusterId }) {
  return getKubernetesNodes({
    pagination: {
      page,
      pageSize
    },
    order: {
      by: orderBy,
      direction: orderDirection
    },
    filter: {
      label: query,
      clusterId,
      timeConfig
    }
  });
}

const columnDefinitions = [
  {
    id: 'name',
    label: 'Name',
    getContent(item, { clusterId }) {
      return (
        <SeverityAwareEntityLink
          icon="lib_kubernetes_node"
          label={get(item, ['node', 'name'])}
          href$={getNodeDashboard(get(item, ['node', 'id']), { clusterId })}
        />
      );
    }
  },
  {
    id: 'cpuRequestsAllocation',
    label: 'CPU Requests Alloc.',
    sortable: false,
    getContent(item) {
      return (
        <MetricValue
          snapshotId={get(item, ['node', 'id'])}
          metric="required_cpu_percentage"
          formatter={percentageTwoDecimalPlaces}
          timeWindowAggregation="mean"
        />
      );
    }
  },
  {
    id: 'cpuLimitsAllocation',
    label: 'CPU Limits Alloc.',
    sortable: false,
    getContent(item) {
      return (
        <MetricValue
          snapshotId={get(item, ['node', 'id'])}
          metric="limit_cpu_percentage"
          formatter={percentageTwoDecimalPlaces}
          timeWindowAggregation="mean"
        />
      );
    }
  },
  {
    id: 'memoryRequestsAllocation',
    label: 'Memory Requests Alloc.',
    sortable: false,
    getContent(item) {
      return (
        <MetricValue
          snapshotId={get(item, ['node', 'id'])}
          metric="required_mem_percentage"
          formatter={percentageTwoDecimalPlaces}
          timeWindowAggregation="mean"
        />
      );
    }
  },
  {
    id: 'memoryLimitsAllocation',
    label: 'Memory Limits Alloc.',
    sortable: false,
    getContent(item) {
      return (
        <MetricValue
          snapshotId={get(item, ['node', 'id'])}
          metric="limit_mem_percentage"
          formatter={percentageTwoDecimalPlaces}
          timeWindowAggregation="mean"
        />
      );
    }
  },
  {
    id: 'podAllocation',
    label: 'Pods Alloc.',
    sortable: false,
    getContent(item) {
      return (
        <MetricValue
          snapshotId={get(item, ['node', 'id'])}
          metric="alloc_pods_percentage"
          formatter={percentageTwoDecimalPlaces}
          timeWindowAggregation="mean"
        />
      );
    }
  },
  {
    id: 'internalIp',
    label: 'Internal IP',
    getContent(item) {
      return get(item, ['node', 'internalIp']);
    }
  },
  {
    id: 'maxSeverity',
    label: 'Health',
    sortable: false,
    getContent(item, { timeConfig }) {
      return (
        <KubernetesEntityHealthIndicatorBehavior
          nodeId={item.node.id}
          IndicatorPresenter={HealthIndicatorPresenter}
          timeConfig={timeConfig}
          inContentArea
        />
      );
    }
  }
];
