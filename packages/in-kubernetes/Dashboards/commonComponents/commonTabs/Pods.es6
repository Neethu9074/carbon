import { get } from 'lodash';
import React from 'react';

import KubernetesEntityHealthIndicatorBehavior from 'in-kubernetes/components/KubernetesEntityHealthIndicatorBehavior';
import ServerTableWithUrlBoundState from 'in-components/tables/ServerTable/ServerTableWithUrlBoundState';
import SeverityAwareEntityLink from 'in-components/tables/sharedComponents/SeverityAwareEntityLink';
import HealthIndicatorPresenter from 'in-new-components/health/HealthIndicatorPresenter';
import getKubernetesPods from 'in-subscription/kubernetes/getKubernetesPods';
import KubernetesSeverity from 'in-kubernetes/components/KubernetesSeverity';
import { zeroDecimalPlaces } from 'in-services/formatters/number';
import { getPodDashboard } from 'in-kubernetes/navigation/paths';
import HistoricMetricSparkChart from 'in-charts/SparkChart';
import MetricValue from 'in-components/MetricValue';
import { timeConfig$ } from 'in-stores/timeline';

import locals from './Pods.mless';

const pathSegment = '/pods';
const matrixPrefix = 'pod.';

export default function Pods({ timeConfig, namespaceId, clusterId, deploymentId }) {
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
      timeConfig
    }
  });
}

const columnDefinitions = [
  {
    id: 'label',
    label: 'Name',
    getContent(item, { clusterId, namespaceId, deploymentId, timeConfig }) {
      return (
        <KubernetesSeverity
          clusterId={get(item, ['pod', 'id'])}
          timeConfig={timeConfig}
          renderLink={maxSeverity => (
            <SeverityAwareEntityLink
              icon="lib_kubernetes_pod"
              label={get(item, ['pod', 'label'])}
              href$={getPodDashboard(get(item, ['pod', 'id']), { clusterId, namespaceId, deploymentId })}
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
      return get(item, ['pod', 'phase']);
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
    id: 'hopstIp',
    label: 'Host IP',
    getContent(item) {
      return get(item, ['pod', 'hostIp']);
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

import connectTo from 'in-hoc/connectTo';

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
