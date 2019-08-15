import { get } from 'lodash';
import React from 'react';

import ServerSideSortedMetricValue from 'in-components/tables/sharedComponents/ServerSideSortedMetricValue';
import MetricBasedTwoValueBar from 'in-kubernetes/Dashboards/commonComponents/MetricBasedTwoValueBar';
import getOpenShiftDeploymentConfigs$ from 'in-subscription/kubernetes/getOpenShiftDeploymentConfigs';
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import SeverityAwareEntityLink from 'in-components/tables/sharedComponents/SeverityAwareEntityLink';
import EntityHealthIndicator from 'in-new-components/EntityHealthIndicator/EntityHealthIndicator';
import HealthIndicatorPresenter from 'in-new-components/health/HealthIndicatorPresenter';
import withEmptyTableState from 'in-components/tables/ServerTable/WithEmptyTableState';
import { clusterId, namespaceId, serviceId } from 'in-kubernetes/navigation/matrix';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import { MINIMUM_ROLLUP, getRollupForTimeframe } from 'in-stores/metric/metric';
import EntityCounter from 'in-components/tables/sharedComponents/EntityCounter';
import { getDeploymentConfigDashboard } from 'in-kubernetes/navigation/paths';
import { timeByMillisTwoDecimalPlaces } from 'in-services/formatters/number';

const msFormatter = d => (d < 0 ? 'No activity' : timeByMillisTwoDecimalPlaces(d));
const pathSegment = '/deploymentconfigs';
const matrixPrefix = 'deployment.';

const columnDefinitions = [
  {
    id: 'name',
    label: 'Name',
    getContent(item, { clusterId }) {
      return (
        <SeverityAwareEntityLink
          icon="lib_kubernetes_workload"
          label={get(item, ['deploymentConfig', 'name'])}
          href$={getDeploymentConfigDashboard(get(item, ['deploymentConfig', 'id']), { clusterId })}
          severity={item.entityHealthInfo.maxSeverity}
        />
      );
    }
  },
  {
    id: 'namespace',
    label: 'Namespace',
    getContent(item) {
      return get(item, ['deploymentConfig', 'namespace']);
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
          snapshotId={get(item, ['deploymentConfig', 'id'])}
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
          snapshotId={item.deploymentConfig.id}
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
          snapshotId={item.deploymentConfig.id}
        />
      );
    }
  }
];

const ServerTableWithUrlState = withEmptyTableState({
  Component: createServerTableWithUrlState({
    paginationResettingUrlParameters: [...timeConfigUrlParameters, clusterId, namespaceId, serviceId],
    columnDefinitions,
    defaultOrderBy: 'name',
    defaultOrderDirection: 'ASC',
    pathSegment,
    matrixPrefix
  }),
  columnDefinitions,
  entityName: 'deployment configs'
});

export default function DeploymentConfigsTable(props) {
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
  return getOpenShiftDeploymentConfigs$({
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
