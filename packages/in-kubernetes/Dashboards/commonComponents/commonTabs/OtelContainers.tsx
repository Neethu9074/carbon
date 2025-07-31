/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { filter } from 'lodash';
import React from 'react';

import { KubernetesClusterListItem, EntityHealthInfo, KubernetesCondition, TimeConfig } from '@instana/types';

import {
  clusterIdUrlParameter,
  serviceIdUrlParameter,
  namespaceIdUrlParameter,
  nodeIdUrlParameter,
  cronJobIdUrlParameter,
  daemonSetIdUrlParameter,
  deploymentIdUrlParameter,
  deploymentConfigIdUrlParameter,
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
import { getOtelKubernetesContainersData } from 'in-kubernetes/Dashboards/commonComponents/commonTabs/utils';
import HealthIndicatorPresenter from 'in-components/health/HealthIndicatorPresenter';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import { useOtelContainerDashboard } from 'in-kubernetes/navigation/paths';
import { ColumnDefinition } from 'in-components/tables/ServerTable/types';
import { t } from 'in-i18n';

const pathSegment = '/otel/containers';
const matrixPrefix = 'container.';

const allColumnDefinitions = [
  {
    id: 'label',
    label: t('in-kubernetes:dashboards.name'),
    getContent(
      {
        entityHealthInfo,
        container
      }: {
        entityHealthInfo: EntityHealthInfo;
        container: { label: string; id: string; conditions?: KubernetesCondition[] };
      },
      {
        deploymentId,
        serviceId,
        podId
      }: {
        deploymentId: string;
        serviceId: string;
        podId: string;
      }
    ) {
      const { label: containerLabel, id: containerId } = container;

      const props = {
        deploymentId,
        serviceId,
        containerId,
        severity: entityHealthInfo.maxSeverity,
        containerLabel,
        podId
      };

      return <ContainerLink {...props} />;
    }
  },
  {
    id: 'health',
    label: t('in-kubernetes:dashboards.health'),
    getContent(
      {
        container: { id: containerId },
        entityHealthInfo
      }: { container: { id: string }; entityHealthInfo: EntityHealthInfo },
      { timeConfig }: { timeConfig: TimeConfig }
    ) {
      return (
        <EntityHealthIndicator
          openIssues={entityHealthInfo.openIssues.length}
          maxSeverity={entityHealthInfo.maxSeverity}
          IndicatorPresenter={HealthIndicatorPresenter}
          timeConfig={timeConfig}
          snapshotId={containerId}
          inContentArea
        />
      );
    }
  }
];

const columnDefinitionsWithoutNamespace = filter(allColumnDefinitions, c => c.id != 'namespace');

const ServerTableWithUrlStateWithoutNamespace = createTable(columnDefinitionsWithoutNamespace);

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
      title: t('in-kubernetes:dashboards.noDataAvailable.containersTitle'),
      description: t('in-kubernetes:dashboards.noDataAvailable.containersDescription')
    }),
    paginationResettingUrlParameters: [
      ...timeConfigUrlParameters,
      clusterIdUrlParameter,
      serviceIdUrlParameter,
      namespaceIdUrlParameter,
      nodeIdUrlParameter,
      cronJobIdUrlParameter,
      daemonSetIdUrlParameter,
      deploymentIdUrlParameter,
      deploymentConfigIdUrlParameter,
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

interface ContainersProps {
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

export default function Containers(props: ContainersProps) {
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

  return (
    <>
      <K8sAgentMonitoringIssueNotifications {...props} entityName="containers" />
      <Table
        get={getOtelKubernetesContainersData}
        timeConfig={timeConfig}
        namespaceId={namespaceId}
        workloadControllerId={workloadControllerId}
        clusterId={clusterId}
        serviceId={serviceId}
        nodeId={nodeId}
        cronJobId={cronJobId}
        leftHeader={leftHeader}
      />
    </>
  );
}

interface ContainerLinkProps {
  containerId: string;
  deploymentId?: string;
  serviceId?: string;
  nodeId?: string;
  containerLabel: string;
  severity: number;
}

function ContainerLink({ containerId, deploymentId, nodeId, containerLabel, severity }: ContainerLinkProps) {
  const href = useOtelContainerDashboard(containerId, { deploymentId, nodeId });
  return <SeverityAwareEntityLink icon="lib_kubernetes_pod" label={containerLabel} href={href} severity={severity} />;
}
