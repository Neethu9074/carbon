/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';
import { get } from 'lodash';

import {
  clusterIdUrlParameter,
  serviceIdUrlParameter,
  namespaceIdUrlParameter
} from 'in-kubernetes/navigation/urlParameters';
import K8sAgentMonitoringIssueNotifications from 'in-kubernetes/Dashboards/commonComponents/K8sAgentMonitoringIssueNotifications';
import ServerSideSortedMetricValue from 'in-components/tables/sharedComponents/ServerSideSortedMetricValue';
import MetricBasedTwoValueBar from 'in-kubernetes/Dashboards/commonComponents/MetricBasedTwoValueBar';
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import SeverityAwareEntityLink from 'in-components/tables/sharedComponents/SeverityAwareEntityLink';
import EntityHealthIndicator from 'in-new-components/EntityHealthIndicator/EntityHealthIndicator';
import HealthIndicatorPresenter from 'in-new-components/health/HealthIndicatorPresenter';
import withEmptyTableState from 'in-components/tables/ServerTable/WithEmptyTableState';
import { number, timeByMillisTwoDecimalPlaces } from 'in-services/formatters/number';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import { MINIMUM_ROLLUP, getRollupForTimeframe } from 'in-stores/metric/metric';
import EntityCounter from 'in-components/tables/sharedComponents/EntityCounter';
import Card from 'in-new-components/Card/LightCardV2';

const msFormatter = d => (d < 0 ? 'No activity' : timeByMillisTwoDecimalPlaces(d));
const matrixPrefix = 'deployment.';

const columnDefinitions = [
  {
    id: 'name',
    label: 'Name',
    getContent(item, { clusterId, getWorkloadControllerDashboard }) {
      return (
        <SeverityAwareEntityLink
          icon="lib_kubernetes_workload"
          label={get(item, ['workloadController', 'name'])}
          href$={getWorkloadControllerDashboard(get(item, ['workloadController', 'id']), { clusterId })}
          severity={item.entityHealthInfo.maxSeverity}
        />
      );
    }
  },
  {
    id: 'namespace',
    label: 'Namespace',
    getContent(item) {
      return get(item, ['workloadController', 'namespace']);
    }
  },
  {
    id: 'pods',
    label: 'Pods',
    getContent(item) {
      return <EntityCounter icon="lib_kubernetes_pod" count={item.pods} />;
    }
  },
  {
    id: 'replicas',
    label: 'Replicas',
    sortable: false,
    getContent(item) {
      return (
        <MetricBasedTwoValueBar
          snapshotId={get(item, ['workloadController', 'id'])}
          metrics={['availableReplicas', 'desiredReplicas']}
          labels={['Available', 'Desired']}
          timeWindowAggregation={null}
          formatter={number.compact}
          transformer={number.compact}
        />
      );
    }
  },
  {
    id: 'duration',
    label: 'Last Pending Phase Duration',
    getContent(item, props, columnId) {
      return (
        <ServerSideSortedMetricValue
          snapshotId={get(item, ['workloadController', 'id'])}
          metric={columnId}
          sortedMetricValue={props.orderBy === columnId && item.sortedMetricValue}
          formatter={msFormatter}
        />
      );
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
          snapshotId={get(item, ['workloadController', 'id'])}
          inContentArea
        />
      );
    }
  }
];

const ServerTableWithUrlState = createServerTableWithUrlState({
  Renderer: withEmptyTableState({
    columnDefinitions
  }),
  paginationResettingUrlParameters: [
    ...timeConfigUrlParameters,
    clusterIdUrlParameter,
    serviceIdUrlParameter,
    namespaceIdUrlParameter
  ],
  columnDefinitions,
  defaultOrderBy: 'name',
  defaultOrderDirection: 'ASC',
  matrixPrefix
});

export default function WorkloadControllersTable(props) {
  return (
    <>
      <K8sAgentMonitoringIssueNotifications {...props} />
      <Card>
        <ServerTableWithUrlState
          get={getTableData}
          filterColumnDefinitions={() => {
            const shouldShowDurationColumn =
              props.workloadControllerType === 'deployment' || props.workloadControllerType === 'deploymentConfig';
            return columnDefinition => shouldShowDurationColumn || columnDefinition.id !== 'duration';
          }}
          {...props}
        />
      </Card>
    </>
  );
}

function getTableData({
  query = '',
  page = 1,
  pageSize = 20,
  orderBy = 'name',
  orderDirection = 'ASC',
  timeConfig,
  clusterId,
  namespaceId,
  serviceId,
  getWorkloadControllers$,
  resultTransformer = result => result
}) {
  return getWorkloadControllers$({
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
      clusterId,
      serviceId,
      timeConfig
    },
    granularity: getRollupForTimeframe(timeConfig).rollup || MINIMUM_ROLLUP
  }).map(resultTransformer);
}
