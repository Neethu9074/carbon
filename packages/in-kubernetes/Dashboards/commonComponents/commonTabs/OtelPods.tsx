/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { filter } from 'lodash';
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
// @ts-expect-error TS migration
import K8sAgentMonitoringIssueNotifications from 'in-kubernetes/Dashboards/commonComponents/K8sAgentMonitoringIssueNotifications';
// @ts-expect-error TS migration
import ServerSideSortedK8sMetricValue from 'in-kubernetes/Dashboards/commonComponents/ServerSideSortedK8sMetricValue';
// @ts-expect-error TS migration
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
// @ts-expect-error TS migration
import SeverityAwareEntityLink from 'in-components/tables/sharedComponents/SeverityAwareEntityLink';
// @ts-expect-error TS migration
import EntityHealthIndicator from 'in-components/EntityHealthIndicator/EntityHealthIndicator';
// @ts-expect-error TS migration
import withEmptyTableState from 'in-components/tables/ServerTable/WithEmptyTableState';
// @ts-expect-error TS migration
import { formatDurationAccurately } from 'in-kubernetes/components/TimeFormatter';
import { getOtelKubernetesPodsData } from 'in-kubernetes/Dashboards/commonComponents/commonTabs/utils';
import { KubernetesClusterListItem, EntityHealthInfo, KubernetesCondition } from 'in-types';
import HealthIndicatorPresenter from 'in-components/health/HealthIndicatorPresenter';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import { ColumnDefinition } from 'in-components/tables/ServerTable/types';
import { useOtelPodDashboard } from 'in-kubernetes/navigation/paths';
import podPhases from 'in-kubernetes/podPhases';
import useUrlState from 'in-hooks/useUrlState';
import ComboBox from 'in-components/ComboBox';
import { TimeConfig } from 'in-types';
import { t } from 'in-i18n';

import locals from './Pods.mless';

const pathSegment = '/otel/pods';
const matrixPrefix = 'pod.';

const allColumnDefinitions = [
  {
    id: 'label',
    label: t('in-kubernetes:dashboards.name'),
    getContent(
      {
        entityHealthInfo,
        pod
      }: {
        entityHealthInfo: EntityHealthInfo;
        pod: { label: string; id: string; conditions?: KubernetesCondition[] };
      },
      {
        deploymentId,
        serviceId,
        nodeId
      }: {
        deploymentId: string;
        serviceId: string;
        nodeId: string;
      }
    ) {
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
    id: 'health',
    label: t('in-kubernetes:dashboards.health'),
    getContent(
      { pod: { id: podId }, entityHealthInfo }: { pod: { id: string }; entityHealthInfo: EntityHealthInfo },
      { timeConfig }: { timeConfig: TimeConfig }
    ) {
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

interface TableComponentProps {
  get: (...args: any[]) => any;
  timeConfig: TimeConfig;
  namespaceId?: string;
  workloadControllerId?: string;
  clusterId?: string;
  serviceId?: string;
  nodeId?: string;
  cronJobId?: string;
  rightHeader?: React.ReactNode;
  leftHeader?: React.ReactNode;
  phase?: string;
}

type TableComponentType = React.ComponentType<TableComponentProps>;

function createTable(columnDefinitions: Array<ColumnDefinition<any, any>>): TableComponentType {
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

export function PodsWithNamespaces({
  timeConfig,
  ...props
}: { timeConfig: TimeConfig } & Omit<PodsProps, 'timeConfig'>) {
  return <Pods timeConfig={timeConfig} Table={ServerTableWithUrlState} {...props} />;
}

const urlStateDefinition = {
  bind: [phasePodListUrlParameter]
};

interface PodsProps {
  timeConfig: TimeConfig;
  namespaceId?: string;
  clusterId?: string;
  workloadControllerId?: string;
  serviceId?: string;
  leftHeader?: React.ReactNode;
  nodeId?: string;
  cronJobId?: string;
  Table?: TableComponentType;
  data?: KubernetesClusterListItem | Record<string, never>;
}

interface PhaseUrlState {
  phase?: string | null;
}

export default function Pods(props: PodsProps) {
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

  const [{ phase }, setPhase] = useUrlState<PhaseUrlState>(urlStateDefinition);

  const rightHeader: React.ReactNode = (
    <ComboBox
      placeholder={t('in-kubernetes:dashboards.placeholderPhase')}
      value={phase}
      isSearchable={false}
      onChange={option =>
        setPhase({
          phase: option && !Array.isArray(option) ? (option as { value: string }).value : null
        })
      }
      options={podPhases}
      className={locals.filter}
    />
  );

  return (
    <>
      <K8sAgentMonitoringIssueNotifications {...props} entityName="pods" />
      <Table
        get={getOtelKubernetesPodsData}
        timeConfig={timeConfig}
        namespaceId={namespaceId}
        workloadControllerId={workloadControllerId}
        clusterId={clusterId}
        serviceId={serviceId}
        nodeId={nodeId}
        cronJobId={cronJobId}
        rightHeader={rightHeader}
        leftHeader={leftHeader}
        phase={phase ?? undefined}
      />
    </>
  );
}

interface PodLinkProps {
  podId: string;
  deploymentId?: string;
  serviceId?: string;
  nodeId?: string;
  podLabel: string;
  severity: number;
}

function PodLink({ podId, deploymentId, nodeId, podLabel, severity }: PodLinkProps) {
  const href = useOtelPodDashboard(podId, { deploymentId, nodeId });
  return <SeverityAwareEntityLink icon="lib_kubernetes_pod" label={podLabel} href={href} severity={severity} />;
}
