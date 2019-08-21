import { get, filter, some } from 'lodash';
import { compose } from 'recompose';
import React from 'react';

import {
  clusterId,
  serviceId,
  namespaceId,
  podId,
  nodeId,
  deploymentId,
  deploymentConfigId
} from 'in-kubernetes/navigation/matrix';
import ServerSideSortedMetricValue from 'in-components/tables/sharedComponents/ServerSideSortedMetricValue';
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import SeverityAwareEntityLink from 'in-components/tables/sharedComponents/SeverityAwareEntityLink';
import EntityHealthIndicator from 'in-new-components/EntityHealthIndicator/EntityHealthIndicator';
import KubernetesResources from 'in-kubernetes/Dashboards/commonComponents/KubernetesResources';
import HealthIndicatorPresenter from 'in-new-components/health/HealthIndicatorPresenter';
import withEmptyTableState from 'in-components/tables/ServerTable/WithEmptyTableState';
import { valueMissingPlaceholder } from 'in-new-components/valueMissingPlaceholder';
import { buildJsonSerializer, buildJsonParser } from 'in-stores/navigation/matrix';
import { resourceQuotaBytes, resourceQuotaNumber } from 'in-kubernetes/formatters';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import { MINIMUM_ROLLUP, getRollupForTimeframe } from 'in-stores/metric/metric';
import getKubernetesPods from 'in-subscription/kubernetes/getKubernetesPods';
import { canSortByMetricColumns } from 'in-services/featureFlags';
import { zeroDecimalPlaces } from 'in-services/formatters/number';
import { getPodDashboard } from 'in-kubernetes/navigation/paths';
import { formatDuration } from 'in-services/formatters/date';
import TwoValueBar from 'in-new-components/TwoValueBar';
import MetricValue from 'in-components/MetricValue';
import podPhases from 'in-kubernetes/podPhases';
import withUrlState from 'in-hoc/withUrlState';
import ComboBox from 'in-components/ComboBox';
import theme from 'in-themes';

import locals from './Pods.mless';

const pathSegment = '/pods';
const matrixPrefix = 'pod.';

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
    optional: true,
    getContent(item) {
      return item.pod.namespace;
    }
  },
  {
    id: 'status',
    label: 'Status',
    optional: true,
    getContent(item) {
      return <span>{get(item, ['pod', 'status', 'statusSummary'], valueMissingPlaceholder)}</span>;
    }
  },
  {
    id: 'phase',
    label: 'Phase',
    optional: true,
    getContent(item) {
      return <span>{get(item, ['pod', 'status', 'phase'], valueMissingPlaceholder)}</span>;
    }
  },
  {
    id: 'ready',
    label: 'Ready',
    optional: true,
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
    optional: true,
    sortable: canSortByMetricColumns,
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
    optional: true,
    getContent(item) {
      return item.pod.age && formatDuration(item.pod.age);
    }
  },
  {
    id: 'resources',
    label: 'Resources',
    optional: true,
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
    id: 'cpuRequests',
    label: 'CPU Requests',
    optional: true,
    sortable: canSortByMetricColumns,
    getContent(item) {
      return <MetricValue snapshotId={item.pod.id} metric="cpuRequests" formatter={resourceQuotaNumber} />;
    }
  },
  {
    id: 'cpuLimits',
    label: 'CPU Limits',
    optional: true,
    sortable: canSortByMetricColumns,
    getContent(item) {
      return <MetricValue snapshotId={item.pod.id} metric="cpuLimits" formatter={resourceQuotaNumber} />;
    }
  },
  {
    id: 'memoryRequests',
    label: 'Memory Requests',
    optional: true,
    sortable: canSortByMetricColumns,
    getContent(item) {
      return <MetricValue snapshotId={item.pod.id} metric="memoryRequests" formatter={resourceQuotaBytes} />;
    }
  },
  {
    id: 'memoryLimits',
    label: 'Memory Limits',
    optional: true,
    sortable: canSortByMetricColumns,
    getContent(item) {
      return <MetricValue snapshotId={item.pod.id} metric="memoryLimits" formatter={resourceQuotaBytes} />;
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

const ServerTableWithUrlStateWithoutNamespace = createTable(columnDefinitionsWithoutNamespace);
const ServerTableWithUrlState = createTable(allColumnDefinitions);

function createTable(columnDefinitions) {
  return withEmptyTableState({
    Component: createServerTableWithUrlState({
      paginationResettingUrlParameters: [
        ...timeConfigUrlParameters,
        clusterId,
        serviceId,
        namespaceId,
        podId,
        nodeId,
        deploymentId,
        deploymentConfigId
      ],
      columnDefinitions,
      defaultOrderBy: 'name',
      defaultOrderDirection: 'ASC',
      defaultDisabledColumns: ['phase', 'cpuRequests', 'cpuLimits', 'memoryRequests', 'memoryLimits'],
      settingsKey: 'table_disabled_columns_pods',
      pathSegment,
      matrixPrefix
    }),
    columnDefinitions,
    entityName: 'pods'
  });
}

export function PodsWithNamespaces({ ...props }) {
  return <Pods columnDefinitions={allColumnDefinitions} Table={ServerTableWithUrlState} {...props} />;
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
)(function Pods(props) {
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

  const {
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
    Table = ServerTableWithUrlStateWithoutNamespace
  } = props;

  return (
    <Table
      get={getTableData}
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
    />
  );
});

function getTableData({
  query = '',
  page = 1,
  pageSize = 20,
  orderBy = 'name',
  orderDirection = 'ASC',
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
