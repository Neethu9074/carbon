import { get } from 'lodash';
import React from 'react';

import ServerTableWithUrlBoundState from 'in-components/tables/ServerTable/ServerTableWithUrlBoundState';
import { resourceQuotaPercentage } from 'in-forge/plugins/kubernetesCluster/formatters/resourceQuota';
import getKubernetesNamespaces from 'in-subscription/kubernetes/getKubernetesNamespaces';
import EntityCounter from 'in-components/tables/sharedComponents/EntityCounter';
import { getNamespaceDashboard } from 'in-kubernetes/navigation/paths';
import EntityLink from 'in-new-components/EntityLink';
import MetricValue from 'in-components/MetricValue';

const pathSegment = '/namespaces';
const matrixPrefix = 'namespace.';

export default function Namespaces({ timeConfig, clusterId }) {
  return (
    <ServerTableWithUrlBoundState
      cardTitle="Namespaces"
      pathSegment={pathSegment}
      matrixPrefix={matrixPrefix}
      get={getTableData}
      columnDefinitions={columnDefinitions}
      timeConfig={timeConfig}
      clusterId={clusterId}
      paginationResettingProps={['clusterId', 'timeConfig']}
      defaultOrderBy="label"
      defaultOrderDirection="ASC"
    />
  );
}

function getTableData({ query, page, pageSize, orderBy, orderDirection, timeConfig, clusterId }) {
  return getKubernetesNamespaces({
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
    id: 'label',
    label: 'Name',
    getContent(item, { clusterId }) {
      return (
        <EntityLink
          icon="lib_kubernetes_namespace"
          label={get(item, ['namespace', 'label'])}
          href$={getNamespaceDashboard(get(item, ['namespace', 'id']), { clusterId })}
        />
      );
    }
  },
  {
    id: 'deployments',
    label: 'Deployments',
    getContent(item) {
      return <EntityCounter icon="lib_kubernetes_workload" count={item.deployments} />;
    }
  },
  {
    id: 'service',
    label: 'Services',
    getContent(item) {
      return <EntityCounter icon="lib_kubernetes_service" count={item.services} />;
    }
  },
  {
    id: 'pods',
    label: 'Pods',
    getContent(item) {
      return <EntityCounter icon="lib_kubernetes_pod" count={item.pods} />;
    }
  },
  {
    id: 'cpuRequestsAllocation',
    label: 'CPU Requests Alloc.',
    sortable: false,
    getContent(item) {
      return (
        <MetricValue
          snapshotId={get(item, ['namespace', 'id'])}
          metric="required_cpu_percentage"
          formatter={resourceQuotaPercentage}
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
          snapshotId={get(item, ['namespace', 'id'])}
          metric="limit_cpu_percentage"
          formatter={resourceQuotaPercentage}
          timeWindowAggregation="mean"
        />
      );
    }
  },
  {
    id: 'memRequestsAllocation',
    label: 'Memory Requests Alloc.',
    sortable: false,
    getContent(item) {
      return (
        <MetricValue
          snapshotId={get(item, ['namespace', 'id'])}
          metric="required_mem_percentage"
          formatter={resourceQuotaPercentage}
          timeWindowAggregation="mean"
        />
      );
    }
  },
  {
    id: 'memLimitsAllocation',
    label: 'Memory Limits Alloc.',
    sortable: false,
    getContent(item) {
      return (
        <MetricValue
          snapshotId={get(item, ['namespace', 'id'])}
          metric="limit_mem_percentage"
          formatter={resourceQuotaPercentage}
          timeWindowAggregation="mean"
        />
      );
    }
  },
  {
    id: 'podsAllocation',
    label: 'Pods Alloc.',
    sortable: false,
    getContent(item) {
      return (
        <MetricValue
          snapshotId={get(item, ['namespace', 'id'])}
          metric="used_pods_percentage"
          formatter={resourceQuotaPercentage}
          timeWindowAggregation="mean"
        />
      );
    }
  }
];
