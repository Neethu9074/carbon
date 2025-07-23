/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';
import { get } from 'lodash';
import {
  bytesTwoDecimalPlaces,
  bytesZeroDecimalPlaces,
  percentageZeroDecimalPlaces,
  percentageTwoDecimalPlaces
} from 'in-services/formatters/number';
// @ts-expect-error TS migration
import InfrastructureMetricSparkChart from 'in-components/SparkChart/InfrastructureMetricSparkChart';
// @ts-expect-error TS migration
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
// @ts-expect-error TS migration
import SeverityAwareEntityLink from 'in-components/tables/sharedComponents/SeverityAwareEntityLink';
// @ts-expect-error TS migration
import EntityHealthIndicator from 'in-components/EntityHealthIndicator/EntityHealthIndicator';
import getOtelKubernetesContainers from 'in-kubernetes/subscriptions/getOtelKubernetesContainers';
import K8DashboardsMarkerLanes from 'in-kubernetes/Dashboards/K8DashboardsMarkerLanes';
// @ts-expect-error TS migration
import withEmptyTableState from 'in-components/tables/ServerTable/WithEmptyTableState';
import HealthIndicatorPresenter from 'in-components/health/HealthIndicatorPresenter';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import { valueMissingPlaceholder } from 'in-components/valueMissingPlaceholder';
import { useGetDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import { getContainerIconByPlugin } from 'in-kubernetes/utils';
import { clusterIdUrlParameter, namespaceIdUrlParameter, nodeIdUrlParameter } from 'in-kubernetes/navigation/urlParameters';
import Capitalize from 'in-components/Capitalize';
import { t } from 'in-i18n';
import { TimeConfig, EntityHealthInfo } from '@instana/types';

const pathSegment = '/containers';
const matrixPrefix = 'container.';

interface DashboardLinkProps {
  item: ContainerItem;
  timeConfig: TimeConfig;
}

const DashboardLink = ({ item, timeConfig }: DashboardLinkProps) => {
  const href = useGetDashboardLink()(get(item, ['container', 'id']), {
    pathname: '/physical/dashboard',
    to: timeConfig.to ?? undefined,
    focusedMoment: timeConfig.to ?? undefined
  });

  return (
    <SeverityAwareEntityLink
      icon={getContainerIconByPlugin(get(item, ['container', 'plugin'], ''))}
      label={get(item, ['container', 'label'])}
      href={href}
      severity={item.entityHealthInfo.maxSeverity}
    />
  );
};

interface ColumnContext {
  timeConfig: TimeConfig;
}

interface ContainerItem {
  container: {
    id: string;
    label: string;
    plugin?: string;
    namespace?: string;
    nodeName?: string;
    podName?: string;
    status?: string;
  };
  entityHealthInfo: EntityHealthInfo;
}

interface ColumnDefinition {
  id: string;
  label: string;
  sortable?: boolean;
  getContent: (item: ContainerItem, context: ColumnContext) => React.ReactNode;
}

const columnDefinitions: ColumnDefinition[] = [
  {
    id: 'label',
    label: t('in-kubernetes:dashboards.name'),
    getContent: (item, { timeConfig }) => <DashboardLink item={item} timeConfig={timeConfig} />
  },
  {
    id: 'namespace',
    label: t('in-kubernetes:dashboards.namespace'),
    sortable: true,
    getContent: (item) => {
      const namespace = get(item, ['container', 'namespace']);
      return namespace ? <Capitalize>{namespace}</Capitalize> : valueMissingPlaceholder;
    }
  },
  {
    id: 'pod',
    label: t('in-kubernetes:dashboards.pod'),
    sortable: true,
    getContent: (item) => {
      const podName = get(item, ['container', 'podName']);
      return podName || valueMissingPlaceholder;
    }
  },
  {
    id: 'node',
    label: t('in-kubernetes:dashboards.node'),
    sortable: true,
    getContent: (item) => {
      const nodeName = get(item, ['container', 'nodeName']);
      return nodeName || valueMissingPlaceholder;
    }
  },
  {
    id: 'status',
    label: t('in-kubernetes:dashboards.status'),
    sortable: true,
    getContent: (item) => {
      const status = get(item, ['container', 'status']);
      return status ? <Capitalize>{status}</Capitalize> : valueMissingPlaceholder;
    }
  },
  {
    id: 'cpuTotal',
    label: t('in-kubernetes:dashboards.cpuTotal'),
    sortable: false,
    getContent: (item, { timeConfig }) => {
      return (
        <InfrastructureMetricSparkChart
          snapshotId={get(item, ['container', 'id'])}
          timeConfig={timeConfig}
          formatter={percentageZeroDecimalPlaces}
          tooltipFormatter={percentageTwoDecimalPlaces}
          metric="cpu.total_usage"
          renderPostChartContent={K8DashboardsMarkerLanes}
        />
      );
    }
  },
  {
    id: 'memoryUsage',
    label: t('in-kubernetes:dashboards.memoryUsage'),
    sortable: false,
    getContent: (item, { timeConfig }) => {
      return (
        <InfrastructureMetricSparkChart
          snapshotId={get(item, ['container', 'id'])}
          timeConfig={timeConfig}
          formatter={bytesZeroDecimalPlaces}
          tooltipFormatter={bytesTwoDecimalPlaces}
          metric="memory.usage"
          renderPostChartContent={K8DashboardsMarkerLanes}
        />
      );
    }
  },
  {
    id: 'health',
    label: t('in-kubernetes:dashboards.health'),
    getContent: (item, { timeConfig }) => {
      return (
        <EntityHealthIndicator
          openIssues={item.entityHealthInfo.openIssues.length}
          maxSeverity={item.entityHealthInfo.maxSeverity}
          IndicatorPresenter={HealthIndicatorPresenter}
          timeConfig={timeConfig}
          snapshotId={item.container.id}
          inContentArea
        />
      );
    }
  }
];

const ServerTableWithUrlState = createServerTableWithUrlState({
  Renderer: withEmptyTableState({
    columnDefinitions,
    title: t('in-kubernetes:dashboards.noDataAvailable.containersTitle'),
    description: t('in-kubernetes:dashboards.noDataAvailable.containersDescription')
  }),
  paginationResettingUrlParameters: [
    ...timeConfigUrlParameters,
    clusterIdUrlParameter,
    namespaceIdUrlParameter,
    nodeIdUrlParameter
  ],
  defaultOrderBy: 'health',
  defaultOrderDirection: 'DESC',
  columnDefinitions,
  pathSegment,
  matrixPrefix
});

interface ContainerDashboardProps {
  timeConfig: TimeConfig;
  clusterId?: string;
  namespaceId?: string;
  nodeId?: string;
}

export default function ContainerDashboard(props: ContainerDashboardProps) {
  const { timeConfig, clusterId, namespaceId, nodeId } = props;

  return (
    <ServerTableWithUrlState
      get={getTableData}
      timeConfig={timeConfig}
      clusterId={clusterId}
      namespaceId={namespaceId}
      nodeId={nodeId}
    />
  );
}

function getTableData({
  query = '',
  page = 1,
  pageSize = 20,
  orderBy = 'health',
  orderDirection = 'DESC',
  timeConfig,
  clusterId,
  namespaceId,
  nodeId
}: {
  query?: string;
  page?: number;
  pageSize?: number;
  orderBy?: string;
  orderDirection?: string;
  timeConfig: TimeConfig;
  clusterId?: string;
  namespaceId?: string;
  nodeId?: string;
}) {
  const filter: any = {
    label: query,
    timeConfig
  };

  if (clusterId) filter.clusterId = clusterId;
  if (namespaceId) filter.namespaceId = namespaceId;
  if (nodeId) filter.nodeId = nodeId;

  return getOtelKubernetesContainers({
    pagination: {
      page,
      pageSize
    },
    order: {
      by: orderBy,
      direction: orderDirection
    },
    filter
  });
}
