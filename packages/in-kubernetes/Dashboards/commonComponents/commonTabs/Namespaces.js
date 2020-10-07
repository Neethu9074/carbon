import React from 'react';
import { get, find } from 'lodash';

import K8sAgentMonitoringIssueNotifications from 'in-kubernetes/Dashboards/commonComponents/K8sAgentMonitoringIssueNotifications';
import ServerSideSortedMetricValue from 'in-components/tables/sharedComponents/ServerSideSortedMetricValue';
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import SeverityAwareEntityLink from 'in-components/tables/sharedComponents/SeverityAwareEntityLink';
import EntityHealthIndicator from 'in-new-components/EntityHealthIndicator/EntityHealthIndicator';
import getKubernetesNamespaces from 'in-subscription/kubernetes/getKubernetesNamespaces';
import HealthIndicatorPresenter from 'in-new-components/health/HealthIndicatorPresenter';
import withEmptyTableState from 'in-components/tables/ServerTable/WithEmptyTableState';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import { MINIMUM_ROLLUP, getRollupForTimeframe } from 'in-stores/metric/metric';
import EntityCounter from 'in-components/tables/sharedComponents/EntityCounter';
import { clusterIdUrlParameter } from 'in-kubernetes/navigation/urlParameters';
import { getNamespaceDashboard } from 'in-kubernetes/navigation/paths';
import { resourceQuotaPercentage } from 'in-kubernetes/formatters';
import { isOpenshift } from 'in-kubernetes/clusterDistributions';
import Card from 'in-new-components/Card';

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
    id: 'daemonSets',
    label: 'DaemonSets',
    getContent(item) {
      return <EntityCounter icon="lib_kubernetes_workload" count={item.daemonSets} />;
    }
  },
  {
    id: 'statefulSets',
    label: 'StatefulSets',
    getContent(item) {
      return <EntityCounter icon="lib_kubernetes_workload" count={item.statefulSets} />;
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
    id: 'required_cpu_percentage',
    label: 'CPU Requests Alloc.',
    sortable: true,
    getContent(item, props, columnId) {
      return (
        <ServerSideSortedMetricValue
          snapshotId={get(item, ['namespace', 'id'])}
          metric={columnId}
          sortedMetricValue={props.orderBy === columnId && item.sortedMetricValue}
          formatter={resourceQuotaPercentage}
        />
      );
    }
  },
  {
    id: 'limit_cpu_percentage',
    label: 'CPU Limits Alloc.',
    sortable: true,
    getContent(item, props, columnId) {
      return (
        <ServerSideSortedMetricValue
          snapshotId={get(item, ['namespace', 'id'])}
          metric={columnId}
          sortedMetricValue={props.orderBy === columnId && item.sortedMetricValue}
          formatter={resourceQuotaPercentage}
        />
      );
    }
  },
  {
    id: 'required_mem_percentage',
    label: 'Memory Requests Alloc.',
    sortable: true,
    getContent(item, props, columnId) {
      return (
        <ServerSideSortedMetricValue
          snapshotId={get(item, ['namespace', 'id'])}
          metric={columnId}
          sortedMetricValue={props.orderBy === columnId && item.sortedMetricValue}
          formatter={resourceQuotaPercentage}
        />
      );
    }
  },
  {
    id: 'limit_mem_percentage',
    label: 'Memory Limits Alloc.',
    sortable: true,
    getContent(item, props, columnId) {
      return (
        <ServerSideSortedMetricValue
          snapshotId={get(item, ['namespace', 'id'])}
          metric={columnId}
          sortedMetricValue={props.orderBy === columnId && item.sortedMetricValue}
          formatter={resourceQuotaPercentage}
        />
      );
    }
  },
  {
    id: 'used_pods_percentage',
    label: 'Pods Alloc.',
    sortable: true,
    getContent(item, props, columnId) {
      return (
        <ServerSideSortedMetricValue
          snapshotId={get(item, ['namespace', 'id'])}
          metric={columnId}
          sortedMetricValue={props.orderBy === columnId && item.sortedMetricValue}
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
          inContentArea
        />
      );
    }
  }
];

const ServerTableWithUrlState = createServerTableWithUrlState({
  Renderer: withEmptyTableState({
    columnDefinitions,
    entityName: 'namespaces'
  }),
  paginationResettingUrlParameters: [...timeConfigUrlParameters, clusterIdUrlParameter],
  columnDefinitions,
  defaultOrderBy: 'label',
  defaultOrderDirection: 'ASC',
  pathSegment,
  matrixPrefix
});

export default function Namespaces(props) {
  return (
    <>
      <K8sAgentMonitoringIssueNotifications {...props} entityName="namespaces" />
      <Card>
        <ServerTableWithUrlState
          get={getTableData}
          filterColumnDefinitions={({ result }) => {
            const anyOpenshift =
              result.data &&
              result.data.items &&
              Boolean(
                find(result.data.items, item =>
                  isOpenshift(get(item, ['namespace', 'clusterDistribution'], 'kubernetes'))
                )
              );
            return columnDefinition => anyOpenshift || columnDefinition.id !== 'deploymentConfigs';
          }}
          timeConfig={props.timeConfig}
          clusterId={props.clusterId}
        />
      </Card>
    </>
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
    },
    granularity: getRollupForTimeframe(timeConfig).rollup || MINIMUM_ROLLUP
  });
}
