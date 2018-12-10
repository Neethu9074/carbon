import { get, filter } from 'lodash';
import React from 'react';

import KubernetesEntityHealthIndicatorBehavior from 'in-kubernetes/components/KubernetesEntityHealthIndicatorBehavior';
import { zeroDecimalPlaces, twoDecimalPlaces, bytesTwoDecimalPlaces } from 'in-services/formatters/number';
import ServerTableWithUrlBoundState from 'in-components/tables/ServerTable/ServerTableWithUrlBoundState';
import SeverityAwareEntityLink from 'in-components/tables/sharedComponents/SeverityAwareEntityLink';
import HealthIndicatorPresenter from 'in-new-components/health/HealthIndicatorPresenter';
import getKubernetesPods from 'in-subscription/kubernetes/getKubernetesPods';
import KubernetesSeverity from 'in-kubernetes/components/KubernetesSeverity';
import { getPodDashboard } from 'in-kubernetes/navigation/paths';
import HistoricMetricSparkChart from 'in-charts/SparkChart';
import MetricValue from 'in-components/MetricValue';
import { timeConfig$ } from 'in-stores/timeline';
import Tooltip from 'in-components/Tooltip';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';
import theme from 'in-themes';

import locals from './Pods.mless';

const pathSegment = '/pods';
const matrixPrefix = 'pod.';

export function PodsWithNamespaces({ columnDefinitions = allColumnDefinitions, ...props }) {
  return <Pods columnDefinitions={columnDefinitions} {...props} />;
}

export default function Pods({
  timeConfig,
  namespaceId,
  clusterId,
  deploymentId,
  serviceId,
  columnDefinitions = columnDefinitionsWithoutNamespace
}) {
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

const allColumnDefinitions = [
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
    id: 'namespace',
    label: 'Namespace',
    getContent(item) {
      return get(item, ['pod', 'namespace']);
    }
  },
  {
    id: 'status',
    label: 'Status',
    getContent(item) {
      return getStatusIcon(get(item, ['pod', 'phase']));
    }
  },
  {
    id: 'restarts',
    label: 'Restarts',
    sortable: false,
    getContent(item) {
      return (
        <div className={locals.flexWrapper}>
          <div className={locals.sparkChart}>
            <SparkChart
              snapshotId={get(item, ['pod', 'id'])}
              metric="restartCount"
              formatter={zeroDecimalPlaces}
              aggregation="mean"
            />
          </div>
          <MetricValue
            snapshotId={get(item, ['pod', 'id'])}
            metric="restartCount"
            formatter={zeroDecimalPlaces}
            timeWindowAggregation="mean"
          />
        </div>
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
    label: 'Memory Requests',
    sortable: false,
    getContent(item) {
      return (
        <MetricValue
          snapshotId={get(item, ['pod', 'id'])}
          metric="memoryRequests"
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

const columnDefinitionsWithoutNamespace = filter(allColumnDefinitions, c => c.id != 'namespace');

const SparkChart = connectTo({ timeConfig: timeConfig$ }, function({
  timeConfig,
  snapshotId,
  metric,
  formatter,
  aggregation
}) {
  return (
    <HistoricMetricSparkChart
      timeConfig={timeConfig}
      snapshotId={snapshotId}
      metric={metric}
      tooltipFormatter={formatter}
      aggregation={aggregation}
    />
  );
});

function getStatusIcon(status) {
  let iconType = 'lib_kubernetes_status_unknown';
  let color = theme.lib.colors.failure;

  if (status === 'Pending') {
    iconType = 'lib_kubernetes_status_pending';
    color = theme.lib.colors.warning;
  } else if (status === 'Running') {
    iconType = 'lib_kubernetes_status_running';
    color = theme.lib.colors.success;
  } else if (status === 'Succeeded') {
    iconType = 'lib_kubernetes_status_succeed';
    color = theme.lib.colors.success;
  } else if (status === 'Failed') {
    iconType = 'lib_kubernetes_status_failed';
    color = theme.lib.colors.failure;
  }
  return (
    <Tooltip themeStyle="light" content={status}>
      <SvgIcon type={iconType} width={24} height={24} color={color} />
    </Tooltip>
  );
}
