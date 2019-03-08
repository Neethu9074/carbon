import React, { Fragment } from 'react';
import { compose } from 'recompose';
import { get } from 'lodash';

import KubernetesEntityHealthIndicator from 'in-kubernetes/components/KubernetesEntityHealthIndicatorBehavior/KubernetesEntityHealthIndicator';
import ServerTableWithUrlBoundState from 'in-components/tables/ServerTable/ServerTableWithUrlBoundState';
import SeverityAwareEntityLink from 'in-components/tables/sharedComponents/SeverityAwareEntityLink';
import HealthIndicatorPresenter from 'in-new-components/health/HealthIndicatorPresenter';
import getKubernetesClusters from 'in-subscription/kubernetes/getKubernetesClusters';
import { clusterList, getClusterDashboard } from 'in-kubernetes/navigation/paths';
import EntityCounter from 'in-components/tables/sharedComponents/EntityCounter';
import ListTitle from 'in-new-components/lists/Title';
import { timeConfig$ } from 'in-stores/time/config';
import Title from 'in-components/Title';
import connect from 'in-hoc/connectTo';

const matrixPrefix = 'k8Cluster.';

export default compose(connect({ timeConfig: timeConfig$ }))(ClusterList);

function ClusterList(props) {
  const { timeConfig } = props;
  const leftHeader = <ListTitle>Clusters</ListTitle>;

  return (
    <Fragment>
      <Title title="Clusters" />

      <ServerTableWithUrlBoundState
        get={getTableData}
        pathSegment={clusterList}
        matrixPrefix={matrixPrefix}
        columnDefinitions={columnDefinitions}
        timeConfig={timeConfig}
        paginationResettingProps={['timeConfig']}
        leftHeader={leftHeader}
        defaultOrderBy="name"
        defaultOrderDirection="ASC"
        defaultPageSize={20}
      />
    </Fragment>
  );
}

function getTableData({ query, page, pageSize, orderBy, orderDirection, timeConfig }) {
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

const columnDefinitions = [
  {
    id: 'name',
    label: 'Name',
    getContent(item) {
      return (
        <SeverityAwareEntityLink
          icon="lib_kubernetes_cluster"
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
    id: 'health',
    label: 'Health',
    getContent(item, { timeConfig }) {
      return (
        <KubernetesEntityHealthIndicator
          openIssues={item.entityHealthInfo.openIssues.length}
          maxSeverity={item.entityHealthInfo.maxSeverity}
          IndicatorPresenter={HealthIndicatorPresenter}
          timeConfig={timeConfig}
          clusterId={item.cluster.id}
        />
      );
    }
  }
];
