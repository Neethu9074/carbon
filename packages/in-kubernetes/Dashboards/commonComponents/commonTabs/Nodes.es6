import React from 'react';

import KubernetesEntityHealthIndicator from 'in-kubernetes/components/KubernetesEntityHealthIndicatorBehavior/KubernetesEntityHealthIndicator';
import ServerTableWithUrlBoundState from 'in-components/tables/ServerTable/ServerTableWithUrlBoundState';
import SeverityAwareEntityLink from 'in-components/tables/sharedComponents/SeverityAwareEntityLink';
import KubernetesResources from 'in-kubernetes/Dashboards/commonComponents/KubernetesResources';
import HealthIndicatorPresenter from 'in-new-components/health/HealthIndicatorPresenter';
import getKubernetesNodes from 'in-subscription/kubernetes/getKubernetesNodes';
import { percentageTwoDecimalPlaces } from 'in-services/formatters/number';
import { getNodeDashboard } from 'in-kubernetes/navigation/paths';
import { formatDuration } from 'in-services/formatters/date';

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
    getContent(item) {
      return (
        <SeverityAwareEntityLink
          icon="lib_kubernetes_node"
          label={item.name}
          href$={getNodeDashboard(item.node.id)}
          severity={item.entityHealthInfo.maxSeverity}
        />
      );
    }
  },
  {
    id: 'status',
    label: 'Status',
    getContent(item) {
      return item.node.status;
    }
  },
  {
    id: 'roles',
    label: 'Roles',
    getContent(item) {
      return item.node.roles;
    }
  },
  {
    id: 'age',
    label: 'Age',
    getContent(item) {
      return item.node.age && formatDuration(item.node.age);
    }
  },
  {
    id: 'version',
    label: 'Version',
    getContent(item) {
      return item.node.version;
    }
  },
  {
    id: 'resources',
    label: 'Resources',
    sortable: false,
    getContent(item) {
      return (
        <KubernetesResources
          snapshotId={item.node.id}
          cpuReqMetric="required_cpu_percentage"
          cpuLimitsMetric="limit_cpu_percentage"
          memReqMetric="required_mem_percentage"
          memLimitsMetric="limit_mem_percentage"
          cpuReqMetricFormatter={percentageTwoDecimalPlaces}
          cpuLimitsMetricFormatter={percentageTwoDecimalPlaces}
          memReqMetricFormatter={percentageTwoDecimalPlaces}
          memLimitsMetricFormatter={percentageTwoDecimalPlaces}
        />
      );
    }
  },
  {
    id: 'health',
    label: 'Health',
    getContent(item, { timeConfig }) {
      return (
        <KubernetesEntityHealthIndicator
          openIssues={item.entityHealthInfo.openIssues.length}
          maxSeverity={item.entityHealthInfo.maxSeverity}
          nodeId={item.node.id}
          IndicatorPresenter={HealthIndicatorPresenter}
          timeConfig={timeConfig}
        />
      );
    }
  }
];
