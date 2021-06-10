/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { get, find } from 'lodash';
import React from 'react';

import { Card } from '@instana/components';

import K8sAgentMonitoringIssueNotifications from 'in-kubernetes/Dashboards/commonComponents/K8sAgentMonitoringIssueNotifications';
import ServerSideSortedMetricValue from 'in-components/tables/sharedComponents/ServerSideSortedMetricValue';
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import SeverityAwareEntityLink from 'in-components/tables/sharedComponents/SeverityAwareEntityLink';
import EntityHealthIndicator from 'in-new-components/EntityHealthIndicator/EntityHealthIndicator';
import getKubernetesNamespaces from 'in-subscription/kubernetes/getKubernetesNamespaces';
import withEmptyTableState from 'in-components/tables/ServerTable/WithEmptyTableState';
import HealthIndicatorPresenter from 'in-components/health/HealthIndicatorPresenter';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import EntityCounter from 'in-components/tables/sharedComponents/EntityCounter';
import { clusterIdUrlParameter } from 'in-kubernetes/navigation/urlParameters';
import { getNamespaceDashboard } from 'in-kubernetes/navigation/paths';
import { resourceQuotaPercentage } from 'in-kubernetes/formatters';
import { isOpenshift } from 'in-kubernetes/clusterDistributions';
import { getInfraGranularity } from 'in-stores/metric/metric';
import { t } from 'in-i18n';

const pathSegment = '/namespaces';
const matrixPrefix = 'namespace.';

const columnDefinitions = [
  {
    id: 'label',
    label: t('in-kubernetes:dashboards.name'),
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
    id: 'workloads.deployments',
    label: t('in-kubernetes:dashboards.deployments'),
    getContent({ workloads }) {
      return <EntityCounter icon="lib_kubernetes_workload" count={workloads.deployments} />;
    }
  },
  {
    id: 'workloads.deploymentConfigs',
    label: t('in-kubernetes:dashboards.deploymentConfigs'),
    getContent({ workloads }) {
      return <EntityCounter icon="lib_kubernetes_workload" count={workloads.deploymentConfigs} />;
    }
  },
  {
    id: 'workloads.daemonSets',
    label: t('in-kubernetes:dashboards.daemonSets'),
    getContent({ workloads }) {
      return <EntityCounter icon="lib_kubernetes_workload" count={workloads.daemonSets} />;
    }
  },
  {
    id: 'workloads.statefulSets',
    label: t('in-kubernetes:dashboards.statefulSets'),
    getContent({ workloads }) {
      return <EntityCounter icon="lib_kubernetes_workload" count={workloads.statefulSets} />;
    }
  },
  {
    id: 'services',
    label: t('in-kubernetes:dashboards.services'),
    getContent(item) {
      return <EntityCounter icon="lib_kubernetes_service" count={item.services} />;
    }
  },
  {
    id: 'workloads.pods',
    label: t('in-kubernetes:dashboards.pods'),
    getContent({ workloads }) {
      return <EntityCounter icon="lib_kubernetes_pod" count={workloads.pods} />;
    }
  },
  {
    id: 'required_cpu_percentage',
    label: t('in-kubernetes:dashboards.cpuRequestsAlloc'),
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
    label: t('in-kubernetes:dashboards.cpuLimitsAlloc'),
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
    label: t('in-kubernetes:dashboards.memoryRequestsAlloc'),
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
    label: t('in-kubernetes:dashboards.memoryLimitsAlloc'),
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
    label: t('in-kubernetes:dashboards.podsAlloc'),
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
    label: t('in-kubernetes:dashboards.health'),
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
            return columnDefinition => anyOpenshift || columnDefinition.id !== 'workloads.deploymentConfigs';
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
    granularity: getInfraGranularity(timeConfig)
  });
}
