/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { get } from 'lodash';
import React from 'react';

import type { KubernetesNode, EntityHealthInfo, TimeConfig } from '@instana/types';
import { useObservable } from '@instana/hooks';
import { Card } from '@instana/components';

// @ts-expect-error TS migration
import K8sAgentMonitoringIssueNotifications from 'in-kubernetes/Dashboards/commonComponents/K8sAgentMonitoringIssueNotifications';
// @ts-expect-error TS migration
import ViewWidthRestrictedColumn from 'in-infrastructure/tableView/components/Table/components/ViewWidthRestrictedColumn';
// @ts-expect-error TS migration
import ServerSideSortedMetricValue from 'in-components/tables/sharedComponents/ServerSideSortedMetricValue';
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
import { clusterIdUrlParameter, daemonSetIdUrlParameter } from 'in-kubernetes/navigation/urlParameters';
import { getOtelKubernetesNodesData } from 'in-kubernetes/Dashboards/commonComponents/commonTabs/utils';
import getHostByKubernetesNodeId from 'in-kubernetes/Dashboards/utils/getHostByKubernetesNodeId';
// @ts-expect-error TS migration
import { isEks } from 'in-kubernetes/clusterDistributions';
import HealthIndicatorPresenter from 'in-components/health/HealthIndicatorPresenter';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import { valueMissingPlaceholder } from 'in-components/valueMissingPlaceholder';
import { useGetDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
// @ts-expect-error TS migration
import { getLabel } from 'in-sdk/snapshot';
import { percentageTwoDecimalPlaces } from 'in-services/formatters/number';
import { useOtelNodeDashboard } from 'in-kubernetes/navigation/paths';
import { pendingResult } from 'in-services/fixedObjects';
import EntityLink from 'in-components/EntityLink';
import { shorten } from 'in-services/util/string';
import { t } from 'in-i18n';

const pathSegment = '/otel/nodes';
const matrixPrefix = 'node.';

function EntityHost({
  nodeId,
  timeConfig,
  clusterDistribution
}: {
  nodeId: string;
  timeConfig: TimeConfig;
  clusterDistribution: string;
}) {
  const host = useObservable(getHostByKubernetesNodeId({ nodeId, timeConfig }), []) ?? pendingResult;
  const isEksCluster = isEks(clusterDistribution);
  const isLoading = host && get(host, ['progress', 'loading']);
  const isHostUnmonitored = host?.errors.length > 0;
  const hostData = host?.data;
  const getDashboardLink = useGetDashboardLink();

  if (!isLoading && !isHostUnmonitored) {
    const shortenStringLength = 25;
    const label = getLabel(hostData);
    const shortenedLabel = shorten(getLabel(hostData), shortenStringLength);
    const isLabelShortened = label.length > shortenStringLength;
    const href = getDashboardLink(hostData.get('id'), {
      pathname: '/physical/dashboard',
      to: timeConfig.to ?? undefined,
      focusedMoment: timeConfig.to ?? undefined
    });

    return (
      <EntityLink
        snapshot={hostData}
        label={shortenedLabel ?? ''}
        href={href}
        {...(isLabelShortened && {
          tooltip: getLabel(hostData)
        })}
      />
    );
  }

  return <>{isEksCluster ? t('in-kubernetes:dashboards.fargateNode') : valueMissingPlaceholder}</>;
}

export interface OtelNodeTableItem {
  node: KubernetesNode;
  name: string;
  entityHealthInfo: EntityHealthInfo;
  age?: number;
  roles?: string;
  status?: string;
  sortedMetricValue?: number;
  snapshotIdForMetric?: string;
}

const columnDefinitions = [
  {
    id: 'name',
    label: t('in-kubernetes:dashboards.name'),
    getContent(item: OtelNodeTableItem) {
      const { node, name, entityHealthInfo } = item;
      return <NodeLink id={node.id} name={name} entityHealthInfo={entityHealthInfo} />;
    }
  },
  {
    id: 'status',
    label: t('in-kubernetes:dashboards.status'),
    getContent(item: OtelNodeTableItem) {
      return item.node.status;
    }
  },
  {
    id: 'roles',
    label: t('in-kubernetes:dashboards.roles'),
    getContent(item: OtelNodeTableItem) {
      return (
        <ViewWidthRestrictedColumn width={15}>{item.node.roles || valueMissingPlaceholder}</ViewWidthRestrictedColumn>
      );
    }
  },
  {
    id: 'age',
    label: t('in-kubernetes:dashboards.age'),
    getContent(item: OtelNodeTableItem) {
      return item.node.age && formatDurationAccurately(item.node.age);
    }
  },
  {
    id: 'required_cpu_percentage',
    label: t('in-kubernetes:dashboards.cpuRequests'),
    sortable: true,
    getContent(item: OtelNodeTableItem, props: any, columnId: string) {
      return (
        <ServerSideSortedMetricValue
          snapshotId={item.node.id}
          metric={columnId}
          sortedMetricValue={props.orderBy === columnId && item.sortedMetricValue}
          formatter={percentageTwoDecimalPlaces}
        />
      );
    }
  },
  {
    id: 'limit_cpu_percentage',
    label: t('in-kubernetes:dashboards.cpuLimits'),
    sortable: true,
    getContent(item: OtelNodeTableItem, props: any, columnId: string) {
      return (
        <ServerSideSortedMetricValue
          snapshotId={item.node.id}
          metric={columnId}
          sortedMetricValue={props.orderBy === columnId && item.sortedMetricValue}
          formatter={percentageTwoDecimalPlaces}
        />
      );
    }
  },
  {
    id: 'required_mem_percentage',
    label: t('in-kubernetes:dashboards.memoryRequests'),
    sortable: true,
    getContent(item: OtelNodeTableItem, props: any, columnId: string) {
      return (
        <ServerSideSortedMetricValue
          snapshotId={item.node.id}
          metric={columnId}
          sortedMetricValue={props.orderBy === columnId && item.sortedMetricValue}
          formatter={percentageTwoDecimalPlaces}
        />
      );
    }
  },
  {
    id: 'limit_mem_percentage',
    label: t('in-kubernetes:dashboards.memoryLimits'),
    sortable: true,
    getContent(item: OtelNodeTableItem, props: any, columnId: string) {
      return (
        <ServerSideSortedMetricValue
          snapshotId={item.node.id}
          metric={columnId}
          sortedMetricValue={props.orderBy === columnId && item.sortedMetricValue}
          formatter={percentageTwoDecimalPlaces}
        />
      );
    }
  },
  {
    id: 'health',
    label: t('in-kubernetes:dashboards.health'),
    getContent(item: OtelNodeTableItem, timeConfig: TimeConfig) {
      return (
        <EntityHealthIndicator
          openIssues={item.entityHealthInfo.openIssues.length}
          maxSeverity={item.entityHealthInfo.maxSeverity}
          IndicatorPresenter={HealthIndicatorPresenter}
          timeConfig={timeConfig}
          snapshotId={item.node.id}
          inContentArea
        />
      );
    }
  },
  {
    id: 'host',
    label: t('in-kubernetes:dashboards.monitoredByInstana'),
    sortable: false,
    getContent(snapshotIdForMetric: string, timeConfig: TimeConfig, clusterDistribution: string ) {
      return (
        <EntityHost nodeId={snapshotIdForMetric} timeConfig={timeConfig} clusterDistribution={clusterDistribution} />
      );
    }
  }
];

const ServerTableWithUrlState = createServerTableWithUrlState({
  Renderer: withEmptyTableState({
    columnDefinitions,
    title: t('in-kubernetes:dashboards.noDataAvailable.nodesTitle'),
    description: t('in-kubernetes:dashboards.noDataAvailable.nodesDescription')
  }),
  paginationResettingUrlParameters: [...timeConfigUrlParameters, clusterIdUrlParameter, daemonSetIdUrlParameter],
  columnDefinitions,
  defaultOrderBy: 'name',
  defaultOrderDirection: 'ASC',
  pathSegment,
  matrixPrefix
});

export default function Nodes(props: any) {
  return (
    <>
      <K8sAgentMonitoringIssueNotifications {...props} entityName="nodes" />
      <Card>
        <ServerTableWithUrlState get={getOtelKubernetesNodesData} {...props} />
      </Card>
    </>
  );
}

type NodeLinkProps = {
  id: string;
  name: string;
  entityHealthInfo: {
    maxSeverity: number;
    openIssues?: any[];
    [key: string]: any;
  };
};

function NodeLink({ id, name, entityHealthInfo }: NodeLinkProps) {
  const href = useOtelNodeDashboard(id);

  return (
    <SeverityAwareEntityLink
      icon="lib_kubernetes_node"
      label={name}
      href={href}
      severity={entityHealthInfo.maxSeverity}
    />
  );
}
