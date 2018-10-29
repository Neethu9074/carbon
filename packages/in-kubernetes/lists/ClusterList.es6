import React, { Fragment } from 'react';
import { compose } from 'recompose';
import { get } from 'lodash';

import ServerTableWithUrlBoundState from 'in-components/tables/ServerTable/ServerTableWithUrlBoundState';
import SeverityAwareEntityLink from 'in-components/tables/sharedComponents/SeverityAwareEntityLink';
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
        defaultOrderBy="label"
        defaultOrderDirection="DESC"
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
    id: 'label',
    label: 'Name',
    getContent(item) {
      return (
        <SeverityAwareEntityLink
          severity={get(item, ['metrics', 'maxSeverity', 0, 1], 0)}
          icon="lib_kubernetes_cluster"
          label={item.label}
          href$={getClusterDashboard(item.id)}
        />
      );
    }
  },
  {
    id: 'namespaces',
    label: 'Namespaces',
    getContent(item) {
      return <EntityCounter icon="lib_kubernetes_namespace" count={item.metrics.namespaces} />;
    }
  },
  {
    id: 'nodes',
    label: 'Nodes',
    getContent(item) {
      return <EntityCounter icon="lib_kubernetes_node" count={item.metrics.nodes} />;
    }
  },
  {
    id: 'pods',
    label: 'Pods',
    getContent(item) {
      return <EntityCounter icon="lib_kubernetes_pod" count={item.metrics.pods} />;
    }
  },
  {
    id: 'service',
    label: 'Services',
    getContent(item) {
      return <EntityCounter icon="lib_kubernetes_service" count={item.metrics.services} />;
    }
  },
  {
    id: 'maxSeverity',
    label: 'Health',
    defaultOrderDirection: 'DESC',
    getContent() {
      return 42;
    }
  }
];
