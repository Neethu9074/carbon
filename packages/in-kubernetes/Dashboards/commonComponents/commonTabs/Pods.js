import { get, filter, some } from 'lodash';
import { compose } from 'recompose';
import React from 'react';

import ServerSideSortedMetricValue from 'in-components/tables/sharedComponents/ServerSideSortedMetricValue';
import ServerTableWithUrlBoundState from 'in-components/tables/ServerTable/ServerTableWithUrlBoundState';
import SeverityAwareEntityLink from 'in-components/tables/sharedComponents/SeverityAwareEntityLink';
import EntityHealthIndicator from 'in-new-components/EntityHealthIndicator/EntityHealthIndicator';
import KubernetesResources from 'in-kubernetes/Dashboards/commonComponents/KubernetesResources';
import HealthIndicatorPresenter from 'in-new-components/health/HealthIndicatorPresenter';
import { valueMissingPlaceholder } from 'in-new-components/valueMissingPlaceholder';
import { buildJsonSerializer, buildJsonParser } from 'in-stores/navigation/matrix';
import { MINIMUM_ROLLUP, getRollupForTimeframe } from 'in-stores/metric/metric';
import getKubernetesPods from 'in-subscription/kubernetes/getKubernetesPods';
import { zeroDecimalPlaces } from 'in-services/formatters/number';
import { getPodDashboard } from 'in-kubernetes/navigation/paths';
import { formatDuration } from 'in-services/formatters/date';
import TwoValueBar from 'in-new-components/TwoValueBar';
import podPhases from 'in-kubernetes/podPhases';
import withUrlState from 'in-hoc/withUrlState';
import ComboBox from 'in-components/ComboBox';
import theme from 'in-themes';

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
  deploymentConfigId,
  serviceId,
  leftHeader,
  nodeId,
  columnDefinitions = columnDefinitionsWithoutNamespace
}) {
  const rightHeader = (
    <ComboBox
      placeholder="Phase…"
      value={phase}
      searchable={false}
      onChange={t => setPhase({ phase: t ? t.value : null })}
      options={podPhases}
      className={locals.filter}
    />
  );

  return (
    <ServerTableWithUrlBoundState
      cardTitle={leftHeader ? undefined : 'Pods'}
      pathSegment={pathSegment}
      matrixPrefix={matrixPrefix}
      get={getTableData}
      columnDefinitions={columnDefinitions}
      timeConfig={timeConfig}
      namespaceId={namespaceId}
      deploymentId={deploymentId}
      deploymentConfigId={deploymentConfigId}
      clusterId={clusterId}
      serviceId={serviceId}
      nodeId={nodeId}
      rightHeader={rightHeader}
      leftHeader={leftHeader}
      phase={phase}
      paginationResettingProps={[
        'namespaceId',
        'clusterId',
        'deploymentId',
        'deploymentConfigId',
        'serviceId',
        'nodeId',
        'timeConfig'
      ]}
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
  deploymentConfigId,
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
      deploymentConfigId,
      clusterId,
      serviceId,
      nodeId,
      timeConfig,
      phase
    },
    granularity: getRollupForTimeframe(timeConfig).rollup || MINIMUM_ROLLUP
  });
}

const allColumnDefinitions = [
  {
    id: 'label',
    label: 'Name',
    getContent(item, { deploymentId, serviceId, nodeId }) {
      return (
        <SeverityAwareEntityLink
          icon="lib_kubernetes_pod"
          label={item.pod.label}
          href$={getPodDashboard(item.pod.id, { deploymentId, serviceId, nodeId })}
          severity={item.entityHealthInfo.maxSeverity}
        />
      );
    }
  },
  {
    id: 'namespace',
    label: 'Namespace',
    getContent(item) {
      return item.pod.namespace;
    }
  },
  {
    id: 'status',
    label: 'Status',
    getContent(item) {
      return <span>{get(item, ['pod', 'status', 'statusSummary'], valueMissingPlaceholder)}</span>;
    }
  },
  {
    id: 'ready',
    label: 'Ready',
    sortable: false,
    getContent(item) {
      const containerStatuses = get(item, ['pod', 'status', 'containerStatuses'], []);
      return (
        <TwoValueBar
          v1={containerStatuses.filter(c => c.ready).length}
          v2={containerStatuses.length}
          v1Color={theme.lib.colors.lightBlue800}
          v2Color={theme.lib.colors.red800}
          v1Label="Ready"
          v2Label="Total"
          fullDomain={containerStatuses.length}
          formatter={v => v}
        />
      );
    }
  },
  {
    id: 'restartCount',
    label: 'Restarts',
    getContent(item, props, columnId) {
      return (
        <ServerSideSortedMetricValue
          snapshotId={item.pod.id}
          metric={columnId}
          sortedMetricValue={props.orderBy === columnId && item.sortedMetricValue}
          formatter={zeroDecimalPlaces}
        />
      );
    }
  },
  {
    id: 'age',
    label: 'Age',
    getContent(item) {
      return item.pod.age && formatDuration(item.pod.age);
    }
  },
  {
    id: 'resources',
    label: 'Resources',
    sortable: false,
    getContent(item) {
      return (
        <KubernetesResources
          snapshotId={item.pod.id}
          quotasPresent={quotasPresentForPod(item.pod)}
          cpuReqMetric="cpuRequests"
          cpuLimitsMetric="cpuLimits"
          memReqMetric="memoryRequests"
          memLimitsMetric="memoryLimits"
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
          snapshotId={item.pod.id}
        />
      );
    }
  }
];

const columnDefinitionsWithoutNamespace = filter(allColumnDefinitions, c => c.id != 'namespace');

function quotasPresentForPod(pod) {
  return [podHasMemoryQuotas(pod) && 'memory', podHasCpuQuotas(pod) && 'cpu'].filter(Boolean).join(', ');
}

function podHasMemoryQuotas(pod) {
  return pod.resources && some(pod.resources, c => c.memoryLimits >= 0 || c.memoryRequests >= 0);
}

function podHasCpuQuotas(pod) {
  return pod.resources && some(pod.resources, c => c.cpuLimits >= 0 || c.cpuRequests >= 0);
}

export default Pods;
