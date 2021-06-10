/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Card } from '@instana/components';

import K8sAgentMonitoringIssueNotifications from 'in-kubernetes/Dashboards/commonComponents/K8sAgentMonitoringIssueNotifications';
import ViewWidthRestrictedColumn from 'in-infrastructure/tableView/components/Table/components/ViewWidthRestrictedColumn';
import ServerSideSortedMetricValue from 'in-components/tables/sharedComponents/ServerSideSortedMetricValue';
import { clusterIdUrlParameter, daemonSetIdUrlParameter } from 'in-kubernetes/navigation/urlParameters';
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import SeverityAwareEntityLink from 'in-components/tables/sharedComponents/SeverityAwareEntityLink';
import EntityHealthIndicator from 'in-components/EntityHealthIndicator/EntityHealthIndicator';
import withEmptyTableState from 'in-components/tables/ServerTable/WithEmptyTableState';
import HealthIndicatorPresenter from 'in-components/health/HealthIndicatorPresenter';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import { valueMissingPlaceholder } from 'in-components/valueMissingPlaceholder';
import getKubernetesNodes from 'in-subscription/kubernetes/getKubernetesNodes';
import { percentageTwoDecimalPlaces } from 'in-services/formatters/number';
import { getNodeDashboard } from 'in-kubernetes/navigation/paths';
import { getInfraGranularity } from 'in-stores/metric/metric';
import { formatDuration } from 'in-services/formatters/date';
import { t } from 'in-i18n';

const pathSegment = '/nodes';
const matrixPrefix = 'node.';

const columnDefinitions = [
  {
    id: 'name',
    label: t('in-kubernetes:dashboards.name'),
    getContent(item) {
      return (
        <SeverityAwareEntityLink
          icon="lib_kubernetes_node"
          label={item.name}
          href$={getNodeDashboard(item.node.id)}
          severity={item.entityHealthInfo.maxSeverity}
        />
      );
    }
  },
  {
    id: 'status',
    label: t('in-kubernetes:dashboards.status'),
    getContent(item) {
      return item.node.status;
    }
  },
  {
    id: 'roles',
    label: t('in-kubernetes:dashboards.roles'),
    getContent(item) {
      return (
        <ViewWidthRestrictedColumn width={15}>{item.node.roles || valueMissingPlaceholder}</ViewWidthRestrictedColumn>
      );
    }
  },
  {
    id: 'age',
    label: t('in-kubernetes:dashboards.age'),
    getContent(item) {
      return item.node.age && formatDuration(item.node.age);
    }
  },
  {
    id: 'required_cpu_percentage',
    label: t('in-kubernetes:dashboards.cpuRequests'),
    sortable: true,
    getContent(item, props, columnId) {
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
    getContent(item, props, columnId) {
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
    getContent(item, props, columnId) {
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
    getContent(item, props, columnId) {
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
    getContent(item, { timeConfig }) {
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
  }
];

const ServerTableWithUrlState = createServerTableWithUrlState({
  Renderer: withEmptyTableState({
    columnDefinitions,
    entityName: 'nodes'
  }),
  paginationResettingUrlParameters: [...timeConfigUrlParameters, clusterIdUrlParameter, daemonSetIdUrlParameter],
  columnDefinitions,
  defaultOrderBy: 'name',
  defaultOrderDirection: 'ASC',
  pathSegment,
  matrixPrefix
});

export default function Nodes(props) {
  return (
    <>
      <K8sAgentMonitoringIssueNotifications {...props} entityName="nodes" />
      <Card>
        <ServerTableWithUrlState get={getTableData} {...props} />
      </Card>
    </>
  );
}

function getTableData({
  query = '',
  page = 1,
  pageSize = 20,
  orderBy = 'type',
  orderDirection = 'ASC',
  timeConfig,
  clusterId,
  workloadControllerId
}) {
  return getKubernetesNodes({
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
      clusterId,
      workloadControllerId,
      timeConfig
    },
    granularity: getInfraGranularity(timeConfig)
  });
}
