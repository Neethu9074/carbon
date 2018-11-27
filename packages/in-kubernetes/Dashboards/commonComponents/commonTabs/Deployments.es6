import { get } from 'lodash';
import React from 'react';

import KubernetesEntityHealthIndicatorBehavior from 'in-kubernetes/components/KubernetesEntityHealthIndicatorBehavior';
import ServerTableWithUrlBoundState from 'in-components/tables/ServerTable/ServerTableWithUrlBoundState';
import MetricBasedTwoValueBar from 'in-kubernetes/Dashboards/commonComponents/MetricBasedTwoValueBar';
import SeverityAwareEntityLink from 'in-components/tables/sharedComponents/SeverityAwareEntityLink';
import getKubernetesDeployments from 'in-subscription/kubernetes/getKubernetesDeployments';
import HealthIndicatorPresenter from 'in-new-components/health/HealthIndicatorPresenter';
import EntityCounter from 'in-components/tables/sharedComponents/EntityCounter';
import KubernetesSeverity from 'in-kubernetes/components/KubernetesSeverity';
import { timeByMillisTwoDecimalPlaces } from 'in-services/formatters/number';
import { getDeploymentDashboard } from 'in-kubernetes/navigation/paths';
import MetricValue from 'in-components/MetricValue';

const msFormatter = d => (d < 0 ? 'No activity' : timeByMillisTwoDecimalPlaces(d));

const pathSegment = '/deployments';
const matrixPrefix = 'deployment.';

export default function Deployments({ timeConfig, namespaceId, clusterId }) {
  return (
    <ServerTableWithUrlBoundState
      cardTitle="Deployments"
      pathSegment={pathSegment}
      matrixPrefix={matrixPrefix}
      get={getTableData}
      columnDefinitions={columnDefinitions}
      timeConfig={timeConfig}
      clusterId={clusterId}
      namespaceId={namespaceId}
      paginationResettingProps={['namespaceId', 'clusterId', 'timeConfig']}
      defaultOrderBy="name"
      defaultOrderDirection="ASC"
    />
  );
}

function getTableData({ query, page, pageSize, orderBy, orderDirection, timeConfig, clusterId, namespaceId }) {
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
      timeConfig
    }
  });
}

const columnDefinitions = [
  {
    id: 'name',
    label: 'Name',
    getContent(item, { clusterId, namespaceId, timeConfig }) {
      return (
        <KubernetesSeverity
          clusterId={get(item, ['deployment', 'id'])}
          timeConfig={timeConfig}
          renderLink={maxSeverity => (
            <SeverityAwareEntityLink
              icon="lib_kubernetes_workload"
              label={get(item, ['deployment', 'name'])}
              href$={getDeploymentDashboard(get(item, ['deployment', 'id']), { clusterId, namespaceId })}
              severity={maxSeverity}
            />
          )}
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
          snapshotId={get(item, ['deployment', 'id'])}
          metrics={['availableReplicas', 'desiredReplicas']}
          labels={['Available', 'Desired']}
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
          snapshotId={get(item, ['deployment', 'id'])}
          metric="lastDuration"
          formatter={msFormatter}
          timeWindowAggregation="mean"
        />
      );
    }
  },
  {
    id: 'maxSeverity',
    label: 'Health',
    sortable: false,
    getContent(item, { timeConfig }) {
      return (
        <KubernetesEntityHealthIndicatorBehavior
          deploymentId={item.deployment.id}
          IndicatorPresenter={HealthIndicatorPresenter}
          timeConfig={timeConfig}
          inContentArea
        />
      );
    }
  }
];
