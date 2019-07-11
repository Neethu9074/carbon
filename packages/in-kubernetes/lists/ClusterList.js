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
import { timeConfig$ } from 'in-stores/time/config';
import connectTo from 'in-hoc/connectTo';
import Title from 'in-components/Title';

const pathSegment = clusterList;
const matrixPrefix = 'k8Cluster.';

const columnDefinitions = [
  {
    id: 'name',
    label: 'Name',
    getContent(item) {
      const distributionType = get(item, ['cluster', 'distributionType'], 'Kubernetes');
      const clusterIcon = `lib_${distributionType.toLowerCase()}`;
      return (
        <SeverityAwareEntityLink
          icon={clusterIcon}
          label={get(item, ['cluster', 'label'])}
          href$={getClusterDashboard(get(item, ['cluster', 'id']))}
          severity={item.entityHealthInfo.maxSeverity}
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
            filterColumnDefinitionsByResult={result => {
              return columnDefinition => {
                if (
                  result.data &&
                  result.data.items &&
                  find(
                    result.data.items,
                    item => get(item, ['cluster', 'distributionType'], 'Kubernetes') === 'OpenShift'
                  )
                )
                  return true;
                else return columnDefinition.id !== 'deploymentConfigs';
              };
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
