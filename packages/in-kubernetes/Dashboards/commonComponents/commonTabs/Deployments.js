import { get } from 'lodash';
import React from 'react';

import {
  clusterIdUrlParameter,
  serviceIdUrlParameter,
  namespaceIdUrlParameter
} from 'in-kubernetes/navigation/urlParameters';
import ServerSideSortedMetricValue from 'in-components/tables/sharedComponents/ServerSideSortedMetricValue';
import MetricBasedTwoValueBar from 'in-kubernetes/Dashboards/commonComponents/MetricBasedTwoValueBar';
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import SeverityAwareEntityLink from 'in-components/tables/sharedComponents/SeverityAwareEntityLink';
import EntityHealthIndicator from 'in-new-components/EntityHealthIndicator/EntityHealthIndicator';
import getKubernetesDeployments from 'in-subscription/kubernetes/getKubernetesDeployments';
import HealthIndicatorPresenter from 'in-new-components/health/HealthIndicatorPresenter';
import withEmptyTableState from 'in-components/tables/ServerTable/WithEmptyTableState';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import { MINIMUM_ROLLUP, getRollupForTimeframe } from 'in-stores/metric/metric';
import EntityCounter from 'in-components/tables/sharedComponents/EntityCounter';
import { timeByMillisTwoDecimalPlaces } from 'in-services/formatters/number';
import { getDeploymentDashboard } from 'in-kubernetes/navigation/paths';

const msFormatter = d => (d < 0 ? 'No activity' : timeByMillisTwoDecimalPlaces(d));
const pathSegment = '/deployments';
const matrixPrefix = 'deployment.';

const columnDefinitions = [
  {
    id: 'name',
    label: 'Name',
    getContent(item, { clusterId }) {
      return (
        <SeverityAwareEntityLink
          icon="lib_kubernetes_workload"
          label={get(item, ['deployment', 'name'])}
          href$={getDeploymentDashboard(get(item, ['deployment', 'id']), { clusterId })}
          severity={item.entityHealthInfo.maxSeverity}
        />
      );
    }
  },
  {
    id: 'namespace',
    label: 'Namespace',
    getContent(item) {
      return get(item, ['deployment', 'namespace']);
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
          snapshotId={item.deployment.id}
          metrics={['availableReplicas', 'desiredReplicas']}
          labels={['Available', 'Desired']}
          timeWindowAggregation={null}
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
          snapshotId={item.deployment.id}
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
          snapshotId={item.deployment.id}
        />
      );
    }
  }
];

const ServerTableWithUrlState = withEmptyTableState({
  Component: createServerTableWithUrlState({
    paginationResettingUrlParameters: [
      ...timeConfigUrlParameters,
      clusterIdUrlParameter,
      serviceIdUrlParameter,
      namespaceIdUrlParameter
    ],
    columnDefinitions,
    defaultOrderBy: 'name',
    defaultOrderDirection: 'ASC',
    pathSegment,
    matrixPrefix
  }),
  columnDefinitions,
  entityName: 'deployments'
});

export default function DeploymentsTable(props) {
  return <ServerTableWithUrlState get={getTableData} {...props} />;
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
  resultTransformer = result => result
}) {
  return getKubernetesDeployments({
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
