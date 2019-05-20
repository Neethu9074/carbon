import { get } from 'lodash';
import React from 'react';

import MetricBasedTwoValueBar from 'in-kubernetes/Dashboards/commonComponents/MetricBasedTwoValueBar';
import SeverityAwareEntityLink from 'in-components/tables/sharedComponents/SeverityAwareEntityLink';
import EntityHealthIndicator from 'in-new-components/EntityHealthIndicator/EntityHealthIndicator';
import getOpenShiftDeploymentConfigs$ from 'in-subscription/kubernetes/getOpenShiftDeploymentConfigs';
import HealthIndicatorPresenter from 'in-new-components/health/HealthIndicatorPresenter';
import EntityCounter from 'in-components/tables/sharedComponents/EntityCounter';
import { timeByMillisTwoDecimalPlaces } from 'in-services/formatters/number';
import { getDeploymentConfigDashboard } from 'in-kubernetes/navigation/paths';
import MetricValue from 'in-components/MetricValue';

const msFormatter = d => (d < 0 ? 'No activity' : timeByMillisTwoDecimalPlaces(d));

export default function deploymentConfigsTable(TableComponent) {
  return props => (
    <TableComponent
      get={getTableData}
      columnDefinitions={columnDefinitions}
      paginationResettingProps={['namespaceId', 'clusterId', 'timeConfig']}
      defaultOrderBy="name"
      defaultOrderDirection="ASC"
      {...props}
    />
  );
}

function getTableData({
  query,
  page,
  pageSize,
  orderBy,
  orderDirection,
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
    }
  }).map(resultTransformer);
}

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
    id: 'lastPendingPhaseDuration',
    label: 'Last Pending Phase Duration',
    sortable: false,
    getContent(item) {
      return (
        <MetricValue
          snapshotId={get(item, ['deploymentConfig', 'id'])}
          metric="lastDuration"
          formatter={msFormatter}
          timeWindowAggregation="mean"
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
