import React, { Fragment } from 'react';
import { get, filter } from 'lodash';
import { compose } from 'recompose';

import KubernetesEntityHealthIndicator from 'in-kubernetes/components/KubernetesEntityHealthIndicatorBehavior/KubernetesEntityHealthIndicator';
import { zeroDecimalPlaces, twoDecimalPlaces, bytesTwoDecimalPlaces } from 'in-services/formatters/number';
import ServerTableWithUrlBoundState from 'in-components/tables/ServerTable/ServerTableWithUrlBoundState';
import SeverityAwareEntityLink from 'in-components/tables/sharedComponents/SeverityAwareEntityLink';
import HealthIndicatorPresenter from 'in-new-components/health/HealthIndicatorPresenter';
import PodStatusIcon from 'in-kubernetes/Dashboards/commonComponents/PodStatusIcon';
import { buildJsonSerializer, buildJsonParser } from 'in-stores/navigation/matrix';
import getKubernetesPods from 'in-subscription/kubernetes/getKubernetesPods';
import { getPodDashboard } from 'in-kubernetes/navigation/paths';
import HistoricMetricSparkChart from 'in-charts/SparkChart';
import MetricValue from 'in-components/MetricValue';
import { timeConfig$ } from 'in-stores/timeline';
import podPhases from 'in-kubernetes/podPhases';
import withUrlState from 'in-hoc/withUrlState';
import ComboBox from 'in-components/ComboBox';
import connectTo from 'in-hoc/connectTo';

import locals from './Pods.mless';

const pathSegment = '/pods';
const matrixPrefix = 'pod.';

export function PodsWithNamespaces({ columnDefinitions = allColumnDefinitions, ...props }) {
  return <Pods columnDefinitions={columnDefinitions} {...props} />;
}

const Pods = compose(
  withUrlState({
    reducerName: 'setPhase',
    bind: [
      {
        path: pathSegment,
        name: 'phase',
        initialState: null,
        parser: buildJsonParser(null),
        serializer: buildJsonSerializer()
      }
    ]
  })
)(function Pods({
  phase,
  setPhase,
  timeConfig,
  namespaceId,
  clusterId,
  deploymentId,
  serviceId,
  nodeId,
  columnDefinitions = columnDefinitionsWithoutNamespace
}) {
  const rightHeader = (
    <Fragment>
      <ComboBox
        placeholder="Status…"
        value={phase}
        onChange={t => setPhase({ phase: t ? t.value : null })}
        options={podPhases}
        className={locals.filter}
      />
    </Fragment>
  );

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
      nodeId={nodeId}
      rightHeader={rightHeader}
      phase={phase}
      paginationResettingProps={['namespaceId', 'timeConfig']}
      defaultOrderBy="name"
      defaultOrderDirection="ASC"
    />
  );
});

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
  deploymentId,
  nodeId,
  phase
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
      nodeId,
      timeConfig,
      phase
    }
  });
}

const allColumnDefinitions = [
  {
    id: 'label',
    label: 'Name',
    getContent(item, { clusterId, namespaceId, deploymentId, serviceId, nodeId }) {
      return (
        <SeverityAwareEntityLink
          icon="lib_kubernetes_pod"
          label={get(item, ['pod', 'label'])}
          href$={getPodDashboard(get(item, ['pod', 'id']), { clusterId, namespaceId, deploymentId, serviceId, nodeId })}
          severity={item.entityHealthInfo.maxSeverity}
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
      return <PodStatusIcon status={get(item, ['pod', 'phase'])} withTooltip />;
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
    id: 'health',
    label: 'Health',
    getContent(item, { timeConfig }) {
      return (
        <KubernetesEntityHealthIndicator
          openIssues={item.entityHealthInfo.openIssues.length}
          maxSeverity={item.entityHealthInfo.maxSeverity}
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

export default Pods;
