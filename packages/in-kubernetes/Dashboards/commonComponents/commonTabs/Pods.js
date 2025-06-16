/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { get, filter } from 'lodash';
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
import ServerSideSortedK8sMetricValue from 'in-kubernetes/Dashboards/commonComponents/ServerSideSortedK8sMetricValue';
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import SeverityAwareEntityLink from 'in-components/tables/sharedComponents/SeverityAwareEntityLink';
import { getKubernetesPodsData } from 'in-kubernetes/Dashboards/commonComponents/commonTabs/utils';
import EntityHealthIndicator from 'in-components/EntityHealthIndicator/EntityHealthIndicator';
import withEmptyTableState from 'in-components/tables/ServerTable/WithEmptyTableState';
import HealthIndicatorPresenter from 'in-components/health/HealthIndicatorPresenter';
import { resourceQuotaBytes, resourceQuotaNumber } from 'in-kubernetes/formatters';
import { formatDurationAccurately } from 'in-kubernetes/components/TimeFormatter';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import { valueMissingPlaceholder } from 'in-components/valueMissingPlaceholder';
import { zeroDecimalPlaces } from 'in-services/formatters/number';
import { usePodDashboard } from 'in-kubernetes/navigation/paths';
import MetricValue from 'in-components/MetricValue';
import podPhases from 'in-kubernetes/podPhases';
import useUrlState from 'in-hooks/useUrlState';
import ComboBox from 'in-components/ComboBox';
import { t } from 'in-i18n';

import locals from './Pods.mless';

const pathSegment = '/pods';
const matrixPrefix = 'pod.';

const allColumnDefinitions = [
  {
    id: 'label',
    label: t('in-kubernetes:dashboards.name'),
    getContent({ entityHealthInfo, pod }, { deploymentId, serviceId, nodeId }) {
      const { label: podLabel, id: podId } = pod;

      const props = {
        deploymentId,
        serviceId,
        nodeId,
        severity: entityHealthInfo.maxSeverity,
        podLabel,
        podId
      };

      return <PodLink {...props} />;
    }
  },
  {
    id: 'namespace',
    label: t('in-kubernetes:dashboards.namespace'),
    optional: true,
    getContent({ pod: { namespace } }) {
      return namespace;
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
    id: 'online',
    label: 'Online Containers',
    optional: true,
    sortable: false,
    getContent(item) {
      const containerStatuses = get(item, ['pod', 'status', 'containerStatuses'], []);
      return <span>{containerStatuses.filter(c => c.ready).length}</span>;
    }
  },
  {
    id: 'desired',
    label: 'Desired Containers',
    optional: true,
    sortable: false,
    getContent(item) {
      const containerStatuses = get(item, ['pod', 'status', 'containerStatuses'], []);
      return <span>{containerStatuses.length}</span>;
    }
  },
  {
    id: 'restartCount',
    label: t('in-kubernetes:dashboards.restarts'),
    optional: true,
    sortable: true,
    getContent(item, props, columnId) {
      return (
        <ServerSideSortedK8sMetricValue
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
      return item.pod.age && formatDurationAccurately(item.pod.age);
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
    getContent({ pod: { id: podId }, entityHealthInfo }, { timeConfig }) {
      return (
        <EntityHealthIndicator
          openIssues={entityHealthInfo.openIssues.length}
          maxSeverity={entityHealthInfo.maxSeverity}
          IndicatorPresenter={HealthIndicatorPresenter}
          timeConfig={timeConfig}
          snapshotId={podId}
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
      title: t('in-kubernetes:dashboards.noDataAvailable.podsTitle'),
      description: t('in-kubernetes:dashboards.noDataAvailable.podsDescription')
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
    defaultOrderBy: 'health',
    defaultOrderDirection: 'DESC',
    defaultDisabledColumns: ['phase', 'cpuRequests', 'cpuLimits', 'memoryRequests', 'memoryLimits'],
    settingsKey: 'table_disabled_columns_pods',
    pathSegment,
    matrixPrefix
  });
}

export function PodsWithNamespaces({ ...props }) {
  return <Pods columnDefinitions={allColumnDefinitions} Table={ServerTableWithUrlState} {...props} />;
}

const urlStateDefinition = {
  bind: [phasePodListUrlParameter]
};

export default function Pods(props) {
  const {
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

  const [{ phase }, setPhase] = useUrlState(urlStateDefinition);

  const rightHeader = (
    <ComboBox
      placeholder={t('in-kubernetes:dashboards.placeholderPhase')}
      value={phase}
      isSearchable={false}
      onChange={t => setPhase({ phase: t ? t.value : null })}
      options={podPhases}
      className={locals.filter}
    />
  );

  return (
    <>
      <K8sAgentMonitoringIssueNotifications {...props} entityName="pods" />
      <Table
        get={getKubernetesPodsData}
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
    </>
  );
}

function PodLink({ podId, deploymentId, serviceId, nodeId, podLabel, severity }) {
  const href = usePodDashboard(podId, { deploymentId, serviceId, nodeId });
  return <SeverityAwareEntityLink icon="lib_kubernetes_pod" label={podLabel} href={href} severity={severity} />;
}
