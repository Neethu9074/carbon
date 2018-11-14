import React, { Fragment } from 'react';
import { compose } from 'recompose';

import ServerTableWithUrlBoundState from 'in-components/tables/ServerTable/ServerTableWithUrlBoundState';
import getKubernetesClusters from 'in-subscription/kubernetes/getKubernetesClusters';
import { clusterList, getClusterDashboard } from 'in-kubernetes/navigation/paths';
import EntityCounter from 'in-components/tables/sharedComponents/EntityCounter';
import EntityLink from 'in-new-components/EntityLink';
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
    metrics: {
      namespaces: {
        metric: 'namespaces',
        aggregation: 'SUM'
      },
      nodes: {
        metric: 'nodes',
        aggregation: 'SUM'
      },
      pods: {
        metric: 'pods',
        aggregation: 'SUM'
      },
      services: {
        metric: 'services',
        aggregation: 'SUM'
      }
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
        <EntityLink
          icon="lib_kubernetes_cluster"
          label={item.cluster.name}
          href$={getClusterDashboard(item.cluster.id)}
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
    id: 'service',
    label: 'Services',
    getContent(item) {
      return <EntityCounter icon="lib_kubernetes_service" count={item.services} />;
    }
  }
];
