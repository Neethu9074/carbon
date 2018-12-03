import { get } from 'lodash';
import React from 'react';

import KubernetesEntityHealthIndicatorBehavior from 'in-kubernetes/components/KubernetesEntityHealthIndicatorBehavior';
import { zeroDecimalPlaces, twoDecimalPlaces, bytesTwoDecimalPlaces } from 'in-services/formatters/number';
import ServerTableWithUrlBoundState from 'in-components/tables/ServerTable/ServerTableWithUrlBoundState';
import SeverityAwareEntityLink from 'in-components/tables/sharedComponents/SeverityAwareEntityLink';
import HealthIndicatorPresenter from 'in-new-components/health/HealthIndicatorPresenter';
import getKubernetesPods from 'in-subscription/kubernetes/getKubernetesPods';
import KubernetesSeverity from 'in-kubernetes/components/KubernetesSeverity';
import { getPodDashboard } from 'in-kubernetes/navigation/paths';
import MetricValue from 'in-components/MetricValue';

const pathSegment = '/pods';
const matrixPrefix = 'pod.';

export default function Pods({ timeConfig, namespaceId, clusterId, deploymentId, serviceId }) {
  return (
    <ServerTableWithUrlBoundState
      cardTitle="Pods"
      pathSegment={pathSegment}
      matrixPrefix={matrixPrefix}
      get={getTableData}
      columnDefinitions={columnDefinitions}
      timeConfig={timeConfig}
      namespaceId={namespaceId}
      deploymentId={deploymentId}
      clusterId={clusterId}
      serviceId={serviceId}
      paginationResettingProps={['namespaceId', 'timeConfig']}
      defaultOrderBy="name"
      defaultOrderDirection="ASC"
    />
  );
}

function getTableData({
  query,
  page,
  pageSize,
  orderBy,
  orderDirection,
  timeConfig,
  namespaceId,
  clusterId,
  serviceId,
  deploymentId
}) {
  return getKubernetesPods({
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
      namespaceId,
      deploymentId,
      clusterId,
      serviceId,
      timeConfig
    }
  });
}

const columnDefinitions = [
  {
    id: 'label',
    label: 'Name',
    getContent(item, { clusterId, namespaceId, deploymentId, serviceId, timeConfig }) {
      return (
        <KubernetesSeverity
          clusterId={get(item, ['pod', 'id'])}
          timeConfig={timeConfig}
          renderLink={maxSeverity => (
            <SeverityAwareEntityLink
              icon="lib_kubernetes_pod"
              label={get(item, ['pod', 'label'])}
              href$={getPodDashboard(get(item, ['pod', 'id']), { clusterId, namespaceId, deploymentId, serviceId })}
              severity={maxSeverity}
            />
          )}
        />
      );
    }
  },
  {
    id: 'status',
    label: 'Status',
    getContent(item) {
      return get(item, ['pod', 'phase']);
    }
  },
  {
    id: 'restarts',
    label: 'Restarts',
    sortable: false,
    getContent(item) {
      return (
        <MetricValue
          snapshotId={get(item, ['pod', 'id'])}
          metric="restartCount"
          formatter={zeroDecimalPlaces}
          aggregation="mean"
        />
      );
    }
  },
  {
    id: 'cpuRequests',
    label: 'CPU Requests',
    sortable: false,
    getContent(item) {
      return (
        <MetricValue
          snapshotId={get(item, ['pod', 'id'])}
          metric="cpuRequests"
          formatter={twoDecimalPlaces}
          timeWindowAggregation="mean"
        />
      );
    }
  },
  {
    id: 'cpuLimits',
    label: 'CPU Limits',
    sortable: false,
    getContent(item) {
      return (
        <MetricValue
          snapshotId={get(item, ['pod', 'id'])}
          metric="cpuLimits"
          formatter={twoDecimalPlaces}
          timeWindowAggregation="mean"
        />
      );
    }
  },
  {
    id: 'memoryRequests',
    label: 'Memory Limits',
    sortable: false,
    getContent(item) {
      return (
        <MetricValue
          snapshotId={get(item, ['pod', 'id'])}
          metric="memoryLimits"
          formatter={bytesTwoDecimalPlaces}
          timeWindowAggregation="mean"
        />
      );
    }
  },
  {
    id: 'memoryLimits',
    label: 'Memory Limits',
    sortable: false,
    getContent(item) {
      return (
        <MetricValue
          snapshotId={get(item, ['pod', 'id'])}
          metric="memoryLimits"
          formatter={bytesTwoDecimalPlaces}
          timeWindowAggregation="mean"
        />
      );
    }
  },
  {
    id: 'maxSeverity',
    label: 'Health',
    sortable: false,
    getContent(item, { timeConfig }) {
      return (
        <KubernetesEntityHealthIndicatorBehavior
          podId={item.pod.id}
          IndicatorPresenter={HealthIndicatorPresenter}
          timeConfig={timeConfig}
          inContentArea
        />
      );
    }
  }
];
