/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { KubernetesPodListItem, KubernetesQueryFilter } from '@instana/types';

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
  statefulSetIdUrlParameter,
  persistentVolumeClaimIdUrlParameter
} from 'in-kubernetes/navigation/urlParameters';
// @ts-expect-error TS migration
import ServerSideSortedK8sMetricValue from 'in-kubernetes/Dashboards/commonComponents/ServerSideSortedK8sMetricValue';
// @ts-expect-error TS migration
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
// @ts-expect-error TS migration
import SeverityAwareEntityLink from 'in-components/tables/sharedComponents/SeverityAwareEntityLink';
// @ts-expect-error TS migration
import EntityHealthIndicator from 'in-components/EntityHealthIndicator/EntityHealthIndicator';
import {
  getKubernetesPodsData,
  GetKubernetesPodsData
} from 'in-kubernetes/Dashboards/commonComponents/commonTabs/utils';
// @ts-expect-error TS migration
import withEmptyTableState from 'in-components/tables/ServerTable/WithEmptyTableState';
// @ts-expect-error TS migration
import { formatDurationAccurately } from 'in-kubernetes/components/TimeFormatter';
import HealthIndicatorPresenter from 'in-components/health/HealthIndicatorPresenter';
import { resourceQuotaBytes, resourceQuotaNumber } from 'in-kubernetes/formatters';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import { valueMissingPlaceholder } from 'in-components/valueMissingPlaceholder';
import { zeroDecimalPlaces } from 'in-services/formatters/number';
import { usePodDashboard } from 'in-kubernetes/navigation/paths';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

const defaultPathSegment = '/pods';
const matrixPrefix = 'pod.';

interface PodsTableProps extends KubernetesQueryFilter {
  pathSegment?: string;
  isSearchable?: boolean;
  withNamespaces?: boolean;
  optionalColumns?: boolean;
  rightHeader?: React.ReactNode;
  leftHeader?: React.ReactNode;
}

interface PodLinkProps {
  deploymentId?: string;
  nodeId?: string;
  severity: number;
  podLabel: string;
  podId: string;
}

const allColumnDefinitions = [
  {
    id: 'label',
    label: t('in-kubernetes:dashboards.name'),
    getContent({ entityHealthInfo, pod }: KubernetesPodListItem, { deploymentId, nodeId }: GetKubernetesPodsData) {
      const { label: podLabel, id: podId } = pod;

      const props: PodLinkProps = {
        deploymentId,
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
    getContent({ pod: { namespace } }: KubernetesPodListItem) {
      return namespace;
    }
  },
  {
    id: 'status',
    label: t('in-kubernetes:dashboards.status'),
    optional: true,
    getContent(item: KubernetesPodListItem) {
      return <span>{item.pod.status?.statusSummary || valueMissingPlaceholder}</span>;
    }
  },
  {
    id: 'phase',
    label: t('in-kubernetes:dashboards.phase'),
    optional: true,
    getContent(item: KubernetesPodListItem) {
      return <span>{item.pod.status?.phase || valueMissingPlaceholder}</span>;
    }
  },
  {
    id: 'online',
    label: 'Online Containers',
    optional: true,
    sortable: false,
    getContent(item: KubernetesPodListItem) {
      const containerStatuses = item.pod.status?.containerStatuses || [];
      return <span>{containerStatuses.filter(c => c.ready).length}</span>;
    }
  },
  {
    id: 'desired',
    label: 'Desired Containers',
    optional: true,
    sortable: false,
    getContent(item: KubernetesPodListItem) {
      const containerStatuses = item.pod.status?.containerStatuses || [];
      return <span>{containerStatuses.length}</span>;
    }
  },
  {
    id: 'restartCount',
    label: t('in-kubernetes:dashboards.restarts'),
    optional: true,
    sortable: true,
    getContent(item: KubernetesPodListItem, props: GetKubernetesPodsData, columnId: string) {
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
    getContent(item: KubernetesPodListItem) {
      return item.pod.age && formatDurationAccurately(item.pod.age);
    }
  },
  {
    id: 'cpuRequests',
    label: t('in-kubernetes:dashboards.cpuRequests'),
    optional: true,
    sortable: true,
    getContent(item: KubernetesPodListItem) {
      return <MetricValue snapshotId={item.pod.id} metric="cpuRequests" formatter={resourceQuotaNumber} />;
    }
  },
  {
    id: 'cpuLimits',
    label: t('in-kubernetes:dashboards.cpuLimits'),
    optional: true,
    sortable: true,
    getContent(item: KubernetesPodListItem) {
      return <MetricValue snapshotId={item.pod.id} metric="cpuLimits" formatter={resourceQuotaNumber} />;
    }
  },
  {
    id: 'memoryRequests',
    label: t('in-kubernetes:dashboards.memoryRequests'),
    optional: true,
    sortable: true,
    getContent(item: KubernetesPodListItem) {
      return <MetricValue snapshotId={item.pod.id} metric="memoryRequests" formatter={resourceQuotaBytes} />;
    }
  },
  {
    id: 'memoryLimits',
    label: t('in-kubernetes:dashboards.memoryLimits'),
    optional: true,
    sortable: true,
    getContent(item: KubernetesPodListItem) {
      return <MetricValue snapshotId={item.pod.id} metric="memoryLimits" formatter={resourceQuotaBytes} />;
    }
  },
  {
    id: 'health',
    label: t('in-kubernetes:dashboards.health'),
    getContent({ pod: { id: podId }, entityHealthInfo }: KubernetesPodListItem, { timeConfig }: GetKubernetesPodsData) {
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

const defaultDisabledColumns = ['phase', 'cpuRequests', 'cpuLimits', 'memoryRequests', 'memoryLimits'];

export default function PodsTable(props: PodsTableProps) {
  const {
    pathSegment = defaultPathSegment,
    withNamespaces = false,
    isSearchable = true,
    optionalColumns = true,
    timeConfig,
    namespaceId,
    workloadControllerId,
    clusterId,
    serviceId,
    nodeId,
    cronJobId,
    persistentVolumeClaimId,
    rightHeader,
    leftHeader,
    phase
  } = props;

  const columnDefinitions = allColumnDefinitions
    .filter(c => optionalColumns || !defaultDisabledColumns.includes(c.id))
    .map(({ optional, ...rest }) => (optionalColumns ? { optional, ...rest } : { ...rest }))
    .filter(c => withNamespaces || c.id != 'namespace');

  const ServerTableWithUrlState = createServerTableWithUrlState({
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
      statefulSetIdUrlParameter,
      persistentVolumeClaimIdUrlParameter
    ],
    columnDefinitions,
    defaultOrderBy: 'health',
    defaultOrderDirection: 'DESC',
    defaultDisabledColumns: ['phase', 'cpuRequests', 'cpuLimits', 'memoryRequests', 'memoryLimits'],
    settingsKey: 'table_disabled_columns_pods',
    isSearchable,
    pathSegment,
    matrixPrefix
  });

  return (
    <ServerTableWithUrlState
      get={getKubernetesPodsData}
      timeConfig={timeConfig}
      namespaceId={namespaceId}
      workloadControllerId={workloadControllerId}
      clusterId={clusterId}
      serviceId={serviceId}
      nodeId={nodeId}
      cronJobId={cronJobId}
      persistentVolumeClaimId={persistentVolumeClaimId}
      rightHeader={rightHeader}
      leftHeader={leftHeader}
      phase={phase}
    />
  );
}

function PodLink({ podId, deploymentId, nodeId, podLabel, severity }: PodLinkProps) {
  const href = usePodDashboard(podId, { deploymentId, nodeId });
  return <SeverityAwareEntityLink icon="lib_kubernetes_pod" label={podLabel} href={href} severity={severity} />;
}
