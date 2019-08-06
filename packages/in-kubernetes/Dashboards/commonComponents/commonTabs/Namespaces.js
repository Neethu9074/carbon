import { get, find } from 'lodash';
import React from 'react';

import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import SeverityAwareEntityLink from 'in-components/tables/sharedComponents/SeverityAwareEntityLink';
import EntityHealthIndicator from 'in-new-components/EntityHealthIndicator/EntityHealthIndicator';
import getKubernetesNamespaces from 'in-subscription/kubernetes/getKubernetesNamespaces';
import HealthIndicatorPresenter from 'in-new-components/health/HealthIndicatorPresenter';
import withEmptyTableState from 'in-components/tables/ServerTable/WithEmptyTableState';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import EntityCounter from 'in-components/tables/sharedComponents/EntityCounter';
import { getNamespaceDashboard } from 'in-kubernetes/navigation/paths';
import { resourceQuotaPercentage } from 'in-kubernetes/formatters';
import { clusterId } from 'in-kubernetes/navigation/matrix';
import MetricValue from 'in-components/MetricValue';

const pathSegment = '/namespaces';
const matrixPrefix = 'namespace.';

const columnDefinitions = [
  {
    id: 'label',
    label: 'Name',
    getContent(item) {
      return (
        <SeverityAwareEntityLink
          icon="lib_kubernetes_namespace"
          label={get(item, ['namespace', 'label'])}
          href$={getNamespaceDashboard(get(item, ['namespace', 'id']))}
          severity={item.entityHealthInfo.maxSeverity}
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
    id: 'deploymentConfigs',
    label: 'Deployment Configs',
    getContent(item) {
      return <EntityCounter icon="lib_kubernetes_workload" count={item.deploymentConfigs} />;
    }
  },
  {
    id: 'services',
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
        />
      );
    }
  },
  {
    id: 'health',
    label: 'Health',
    getContent(item, { timeConfig }) {
      return (
        <EntityHealthIndicator
          openIssues={item.entityHealthInfo.openIssues.length}
          maxSeverity={item.entityHealthInfo.maxSeverity}
          IndicatorPresenter={HealthIndicatorPresenter}
          timeConfig={timeConfig}
          snapshotId={item.namespace.id}
        />
      );
    }
  }
];

const ServerTableWithUrlState = withEmptyTableState({
  Component: createServerTableWithUrlState({
    paginationResettingUrlParameters: [...timeConfigUrlParameters, clusterId],
    columnDefinitions,
    defaultOrderBy: 'label',
    defaultOrderDirection: 'ASC',
    pathSegment,
    matrixPrefix
  }),
  columnDefinitions,
  entityName: 'namespaces'
});

export default function Namespaces(props) {
  return (
    <ServerTableWithUrlState
      get={getTableData}
      filterColumnDefinitionsByResult={result => {
        return columnDefinition => {
          if (
            result.data &&
            result.data.items &&
            find(result.data.items, item => get(item, ['namespace', 'distributionType'], 'Kubernetes') === 'OpenShift')
          )
            return true;
          else return columnDefinition.id !== 'deploymentConfigs';
        };
      }}
      timeConfig={props.timeConfig}
      clusterId={props.clusterId}
    />
  );
}

function getTableData({
  query = '',
  page = 1,
  pageSize = 20,
  orderBy = 'label',
  orderDirection = 'ASC',
  timeConfig,
  clusterId
}) {
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
