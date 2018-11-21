import { get } from 'lodash';
import React from 'react';

import ServerTableWithUrlBoundState from 'in-components/tables/ServerTable/ServerTableWithUrlBoundState';
import getKubernetesDeployments from 'in-subscription/kubernetes/getKubernetesDeployments';
import { number, timeByMillisTwoDecimalPlaces } from 'in-services/formatters/number';
import EntityCounter from 'in-components/tables/sharedComponents/EntityCounter';
import { getDeploymentDashboard } from 'in-kubernetes/navigation/paths';
import EntityLink from 'in-new-components/EntityLink';
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
    getContent(item, { clusterId }) {
      return (
        <EntityLink
          icon="lib_kubernetes_workload"
          label={get(item, ['deployment', 'name'])}
          href$={getDeploymentDashboard(get(item, ['deployment', 'id']), { clusterId })}
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
      return <EntityCounter icon="lib_kubernetes_pod" count={get(item, ['deployment', 'pods'])} />;
    }
  },
  {
    id: 'availableReplicas',
    label: 'Available Replicas',
    sortable: false,
    getContent(item) {
      return (
        <MetricValue
          snapshotId={get(item, ['deployment', 'id'])}
          metric="availableReplicas"
          formatter={number.compact}
          timeWindowAggregation="mean"
        />
      );
    }
  },
  {
    id: 'desiredReplicas',
    label: 'Desired Replicas',
    sortable: false,
    getContent(item) {
      return (
        <MetricValue
          snapshotId={get(item, ['deployment', 'id'])}
          metric="desiredReplicas"
          formatter={number.compact}
          timeWindowAggregation="mean"
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
  }
];
