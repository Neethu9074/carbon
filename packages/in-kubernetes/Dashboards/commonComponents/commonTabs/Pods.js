/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import { get, filter } from 'lodash';
import { compose } from 'recompose';
import theme from 'in-themes';
import React from 'react';

import {
  clusterIdUrlParameter,
  serviceIdUrlParameter,
  namespaceIdUrlParameter,
  podIdUrlParameter,
  nodeIdUrlParameter,
  cronJobIdUrlParameter,
  daemonSetIdUrlParameter,
  deploymentIdUrlParameter,
  deploymentConfigIdUrlParameter,
  phasePodListUrlParameter,
  statefulSetIdUrlParameter
} from 'in-kubernetes/navigation/urlParameters';
import K8sAgentMonitoringIssueNotifications from 'in-kubernetes/Dashboards/commonComponents/K8sAgentMonitoringIssueNotifications';
import ServerSideSortedMetricValue from 'in-components/tables/sharedComponents/ServerSideSortedMetricValue';
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import SeverityAwareEntityLink from 'in-components/tables/sharedComponents/SeverityAwareEntityLink';
import EntityHealthIndicator from 'in-new-components/EntityHealthIndicator/EntityHealthIndicator';
import HealthIndicatorPresenter from 'in-new-components/health/HealthIndicatorPresenter';
import withEmptyTableState from 'in-components/tables/ServerTable/WithEmptyTableState';
import { valueMissingPlaceholder } from 'in-new-components/valueMissingPlaceholder';
import { resourceQuotaBytes, resourceQuotaNumber } from 'in-kubernetes/formatters';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import { MINIMUM_ROLLUP, getRollupForTimeframe } from 'in-stores/metric/metric';
import getKubernetesPods from 'in-subscription/kubernetes/getKubernetesPods';
import { zeroDecimalPlaces } from 'in-services/formatters/number';
import { getPodDashboard } from 'in-kubernetes/navigation/paths';
import { formatDuration } from 'in-services/formatters/date';
import TwoValueBar from 'in-new-components/TwoValueBar';
import MetricValue from 'in-components/MetricValue';
import podPhases from 'in-kubernetes/podPhases';
import withUrlState from 'in-hoc/withUrlState';
import ComboBox from 'in-components/ComboBox';
import Card from 'in-new-components/Card';

import locals from './Pods.mless';

const pathSegment = '/pods';
const matrixPrefix = 'pod.';

const allColumnDefinitions = [
  {
    id: 'label',
    label: t('in-kubernetes:dashboards.name'),
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
    label: t('in-kubernetes:dashboards.namespace'),
    optional: true,
    getContent(item) {
      return item.pod.namespace;
    }
  },
  {
    id: 'status',
    label: t('in-kubernetes:dashboards.status'),
    optional: true,
    getContent(item) {
      return <span>{get(item, ['pod', 'status', 'statusSummary'], valueMissingPlaceholder)}</span>;
    }
  },
  {
    id: 'phase',
    label: t('in-kubernetes:dashboards.phase'),
    optional: true,
    getContent(item) {
      return <span>{get(item, ['pod', 'status', 'phase'], valueMissingPlaceholder)}</span>;
    }
  },
  {
    id: 'ready',
    label: t('in-kubernetes:dashboards.ready'),
    optional: true,
    sortable: false,
    getContent(item) {
      const podStatusSummary = get(item, ['pod', 'status', 'statusSummary'], valueMissingPlaceholder);
      const containerStatuses = get(item, ['pod', 'status', 'containerStatuses'], []);
      return (
        <TwoValueBar
          v1={containerStatuses.filter(c => c.ready).length}
          v2={containerStatuses.length}
          v1Color={theme.lib.colors.lightBlue800}
          v2Color={podStatusSummary === 'Completed' ? theme.lib.colors.N400 : theme.lib.colors.red800}
          v1Label={t('in-kubernetes:dashboards.ready')}
          v2Label={t('in-kubernetes:dashboards.total')}
          fullDomain={containerStatuses.length}
          formatter={v => v}
        />
      );
    }
  },
  {
    id: 'restartCount',
    label: t('in-kubernetes:dashboards.restarts'),
    optional: true,
    sortable: true,
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
    label: t('in-kubernetes:dashboards.age'),
    optional: true,
    getContent(item) {
      return item.pod.age && formatDuration(item.pod.age);
    }
  },
  {
    id: 'cpuRequests',
    label: t('in-kubernetes:dashboards.cpuRequests'),
    optional: true,
    sortable: true,
    getContent(item) {
      return <MetricValue snapshotId={item.pod.id} metric="cpuRequests" formatter={resourceQuotaNumber} />;
    }
  },
  {
    id: 'cpuLimits',
    label: t('in-kubernetes:dashboards.cpuLimits'),
    optional: true,
    sortable: true,
    getContent(item) {
      return <MetricValue snapshotId={item.pod.id} metric="cpuLimits" formatter={resourceQuotaNumber} />;
    }
  },
  {
    id: 'memoryRequests',
    label: t('in-kubernetes:dashboards.memoryRequests'),
    optional: true,
    sortable: true,
    getContent(item) {
      return <MetricValue snapshotId={item.pod.id} metric="memoryRequests" formatter={resourceQuotaBytes} />;
    }
  },
  {
    id: 'memoryLimits',
    label: t('in-kubernetes:dashboards.memoryLimits'),
    optional: true,
    sortable: true,
    getContent(item) {
      return <MetricValue snapshotId={item.pod.id} metric="memoryLimits" formatter={resourceQuotaBytes} />;
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
          snapshotId={item.pod.id}
          inContentArea
        />
      );
    }
  }
];

const columnDefinitionsWithoutNamespace = filter(allColumnDefinitions, c => c.id != 'namespace');

const ServerTableWithUrlStateWithoutNamespace = createTable(columnDefinitionsWithoutNamespace);
const ServerTableWithUrlState = createTable(allColumnDefinitions);

function createTable(columnDefinitions) {
  return createServerTableWithUrlState({
    Renderer: withEmptyTableState({
      columnDefinitions,
      entityName: 'pods'
    }),
    paginationResettingUrlParameters: [
      ...timeConfigUrlParameters,
      clusterIdUrlParameter,
      serviceIdUrlParameter,
      namespaceIdUrlParameter,
      podIdUrlParameter,
      nodeIdUrlParameter,
      cronJobIdUrlParameter,
      daemonSetIdUrlParameter,
      deploymentIdUrlParameter,
      deploymentConfigIdUrlParameter,
      phasePodListUrlParameter,
      statefulSetIdUrlParameter
    ],
    columnDefinitions,
    defaultOrderBy: 'name',
    defaultOrderDirection: 'ASC',
    defaultDisabledColumns: ['phase', 'cpuRequests', 'cpuLimits', 'memoryRequests', 'memoryLimits'],
    settingsKey: 'table_disabled_columns_pods',
    pathSegment,
    matrixPrefix
  });
}

export function PodsWithNamespaces({ ...props }) {
  return <Pods columnDefinitions={allColumnDefinitions} Table={ServerTableWithUrlState} {...props} />;
}

const Pods = compose(
  withUrlState({
    reducerName: 'setPhase',
    bind: [phasePodListUrlParameter]
  })
)(function Pods(props) {
  const {
    phase,
    setPhase,
    timeConfig,
    namespaceId,
    clusterId,
    workloadControllerId,
    serviceId,
    leftHeader,
    nodeId,
    cronJobId,
    Table = ServerTableWithUrlStateWithoutNamespace
  } = props;

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
    <>
      <K8sAgentMonitoringIssueNotifications {...props} entityName="pods" />
      <Card>
        <Table
          get={getTableData}
          timeConfig={timeConfig}
          namespaceId={namespaceId}
          workloadControllerId={workloadControllerId}
          clusterId={clusterId}
          serviceId={serviceId}
          nodeId={nodeId}
          cronJobId={cronJobId}
          rightHeader={rightHeader}
          leftHeader={leftHeader}
          phase={phase}
        />
      </Card>
    </>
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
  workloadControllerId,
  nodeId,
  cronJobId,
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
      workloadControllerId,
      clusterId,
      serviceId,
      nodeId,
      cronJobId,
      timeConfig,
      phase
    },
    granularity: getRollupForTimeframe(timeConfig).rollup || MINIMUM_ROLLUP
  });
}

export default Pods;
