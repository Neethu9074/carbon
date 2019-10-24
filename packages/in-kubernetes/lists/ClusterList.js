import React, { Fragment } from 'react';
import { get, find } from 'lodash';

import KubernetesNoDataNotification from 'in-kubernetes/lists/components/KubernetesNoDataNotification';
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import SeverityAwareEntityLink from 'in-components/tables/sharedComponents/SeverityAwareEntityLink';
import EntityHealthIndicator from 'in-new-components/EntityHealthIndicator/EntityHealthIndicator';
import HealthIndicatorPresenter from 'in-new-components/health/HealthIndicatorPresenter';
import getKubernetesClusters from 'in-subscription/kubernetes/getKubernetesClusters';
import { clusterList, getClusterDashboard } from 'in-kubernetes/navigation/paths';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import EntityCounter from 'in-components/tables/sharedComponents/EntityCounter';
import WithEmptyStateFallback from 'in-new-components/WithEmptyStateFallback';
import { isOpenshift } from 'in-kubernetes/clusterDistributions';
import { capitalize } from 'in-services/formatters/string';
import { timeConfig$ } from 'in-stores/time/config';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';
import Title from 'in-components/Title';

import locals from './ClusterList.mless';

const pathSegment = clusterList;
const matrixPrefix = 'k8Cluster.';

const columnDefinitions = [
  {
    id: 'name',
    label: 'Name',
    getContent(item) {
      const clusterDistribution = get(item, ['cluster', 'clusterDistribution'], 'kubernetes');
      const clusterIcon = `lib_${clusterDistribution}`;
      const clusterManagedBy = get(item, ['cluster', 'clusterManagedBy']);
      return (
        <SeverityAwareEntityLink
          icon={clusterIcon}
          label={get(item, ['cluster', 'label'])}
          href$={getClusterDashboard(get(item, ['cluster', 'id']))}
          severity={item.entityHealthInfo.maxSeverity}
          subscriptComponent={<ClusterManagedByWithIcon clusterManagedBy={clusterManagedBy} />}
        />
      );
    }
  },
  {
    id: 'namespaces',
    label: 'Namespaces',
    getContent(item) {
      return <EntityCounter icon="lib_kubernetes_namespace" count={item.namespaces} />;
    }
  },
  {
    id: 'services',
    label: 'Services',
    getContent(item) {
      return <EntityCounter icon="lib_kubernetes_service" count={item.services} />;
    }
  },
  {
    id: 'nodes',
    label: 'Nodes',
    getContent(item) {
      return <EntityCounter icon="lib_kubernetes_node" count={item.nodes} />;
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
    id: 'deployments',
    label: 'Deployments',
    getContent(item) {
      return <EntityCounter icon="lib_kubernetes_workload" count={item.deployments} />;
    }
  },
  {
    id: 'deploymentConfigs',
    label: 'Deployment Configs',
    getContent(item) {
      return <EntityCounter icon="lib_kubernetes_workload" count={item.deploymentConfigs} />;
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
          snapshotId={item.cluster.id}
        />
      );
    }
  }
];

const ServerTableWithUrlState = createServerTableWithUrlState({
  paginationResettingUrlParameters: [...timeConfigUrlParameters],
  columnDefinitions,
  defaultOrderBy: 'name',
  defaultOrderDirection: 'ASC',
  pathSegment,
  matrixPrefix
});

export default connectTo(
  {
    timeConfig: timeConfig$
  },
  function ClusterList({ timeConfig }) {
    return (
      <Fragment>
        <Title title="Clusters" />

        <WithEmptyStateFallback
          getHasDataToRender={getHasDataToRender}
          FallbackComponent={<KubernetesNoDataNotification icon="lib_kubernetes_cluster" />}
        >
          <ServerTableWithUrlState
            get={getTableData}
            filterColumnDefinitions={({ result }) => {
              const anyOpenshift =
                result.data &&
                result.data.items &&
                Boolean(
                  find(result.data.items, item =>
                    isOpenshift(get(item, ['cluster', 'clusterDistribution'], 'kubernetes'))
                  )
                );
              return columnDefinition => anyOpenshift || columnDefinition.id !== 'deploymentConfigs';
            }}
            timeConfig={timeConfig}
          />
        </WithEmptyStateFallback>
      </Fragment>
    );
  }
);

function getTableData(params) {
  return getKubernetesClustersSubscribeEvent(params);
}

function getHasDataToRender() {
  return timeConfig$
    .flatMap(timeConfig => getKubernetesClustersSubscribeEvent({ timeConfig }))
    .map(result => !result.data || result.data.totalHits > 0);
}

function getKubernetesClustersSubscribeEvent({
  query = '',
  page = 1,
  pageSize = 20,
  orderBy = 'name',
  orderDirection = 'ASC',
  timeConfig
}) {
  return getKubernetesClusters({
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
      timeConfig
    }
  });
}

function ClusterManagedByWithIcon({ clusterManagedBy }) {
  if (clusterManagedBy && clusterManagedBy !== 'none') {
    return (
      <div className={locals.clusterManagedBy}>
        <Fragment>
          <span className={locals.clusterManagedByLabel}>Managed by {capitalize(clusterManagedBy)}</span>
          <SvgIcon className={locals.clusterManagedByIcon} type={`lib_${clusterManagedBy}`} />
        </Fragment>
      </div>
    );
  }
  return null;
}
