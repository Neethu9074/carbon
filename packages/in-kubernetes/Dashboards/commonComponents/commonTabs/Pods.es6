import React, { Fragment } from 'react';
import { get, filter } from 'lodash';
import { compose } from 'recompose';

import KubernetesEntityHealthIndicator from 'in-kubernetes/components/KubernetesEntityHealthIndicatorBehavior/KubernetesEntityHealthIndicator';
import PodResourceTooltipContent from 'in-kubernetes/Dashboards/commonComponents/PodResourceTooltipContent';
import ServerTableWithUrlBoundState from 'in-components/tables/ServerTable/ServerTableWithUrlBoundState';
import PodStatusTooltipContent from 'in-kubernetes/Dashboards/commonComponents/PodStatusTooltipContent';
import SeverityAwareEntityLink from 'in-components/tables/sharedComponents/SeverityAwareEntityLink';
import HealthIndicatorPresenter from 'in-new-components/health/HealthIndicatorPresenter';
import { buildJsonSerializer, buildJsonParser } from 'in-stores/navigation/matrix';
import getKubernetesPods from 'in-subscription/kubernetes/getKubernetesPods';
import { zeroDecimalPlaces } from 'in-services/formatters/number';
import { getPodDashboard } from 'in-kubernetes/navigation/paths';
import { formatDuration } from 'in-services/formatters/date';
import TwoValueBar from 'in-new-components/TwoValueBar';
import MetricValue from 'in-components/MetricValue';
import podPhases from 'in-kubernetes/podPhases';
import withUrlState from 'in-hoc/withUrlState';
import ComboBox from 'in-components/ComboBox';
import Tooltip from 'in-components/Tooltip';

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
      paginationResettingProps={['namespaceId', 'clusterId', 'deploymentId', 'serviceId', 'nodeId', 'timeConfig']}
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
    getContent(item, { deploymentId, serviceId, nodeId }) {
      return (
        <SeverityAwareEntityLink
          icon="lib_kubernetes_pod"
          label={get(item, ['pod', 'label'])}
          href$={getPodDashboard(get(item, ['pod', 'id']), { deploymentId, serviceId, nodeId })}
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
    label: 'Status Summary',
    getContent(item) {
      return (
        <Tooltip themeStyle="light" content={<PodStatusTooltipContent pod={item.pod} />}>
          <span>{get(item, ['pod', 'status', 'statusSummary'], '-')}</span>
        </Tooltip>
      );
    }
  },
  {
    id: 'ready',
    label: 'Ready',
    getContent(item) {
      const allContainerStatuses = [
        ...get(item, ['pod', 'status', 'initContainerStatuses'], []),
        ...get(item, ['pod', 'status', 'containerStatuses'], [])
      ];
      return (
        <TwoValueBar
          v1={allContainerStatuses.filter(c => c.ready).length}
          v2={allContainerStatuses.length}
          fullDomain={allContainerStatuses.length}
          renderLabels={false}
        />
      );
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
          timeWindowAggregation="mean"
        />
      );
    }
  },
  {
    id: 'age',
    label: 'Age',
    getContent(item) {
      return item.pod.age ? formatDuration(item.pod.age) : '-';
    }
  },
  {
    id: 'resources',
    label: 'Resources',
    sortable: false,
    getContent(item) {
      return (
        <Tooltip themeStyle="light" content={<PodResourceTooltipContent podId={item.pod.id} />} align="topMiddle">
          <span>memory, cpu</span>
        </Tooltip>
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
        />
      );
    }
  }
];

const columnDefinitionsWithoutNamespace = filter(allColumnDefinitions, c => c.id != 'namespace');

export default Pods;
