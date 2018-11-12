import React, { Fragment } from 'react';
import { compose } from 'recompose';
import { get } from 'lodash';

import ServerTableWithUrlBoundState from 'in-components/tables/ServerTable/ServerTableWithUrlBoundState';
import getKubernetesNamespaces from 'in-subscription/kubernetes/getKubernetesNamespaces';
import { namespaceList, getNamespaceDashboard } from 'in-kubernetes/navigation/paths';
import EntityCounter from 'in-components/tables/sharedComponents/EntityCounter';
import EntityLink from 'in-new-components/EntityLink';
import ListTitle from 'in-new-components/lists/Title';
import { timeConfig$ } from 'in-stores/time/config';
import Title from 'in-components/Title';
import connect from 'in-hoc/connectTo';

const matrixPrefix = 'k8Namespace.';

export default compose(connect({ timeConfig: timeConfig$ }))(NamespaceList);

function NamespaceList({ timeConfig }) {
  const leftHeader = <ListTitle>Namespaces</ListTitle>;

  return (
    <Fragment>
      <Title title="Namespaces" />

      <ServerTableWithUrlBoundState
        get={getTableData}
        pathSegment={namespaceList}
        matrixPrefix={matrixPrefix}
        columnDefinitions={columnDefinitions}
        timeConfig={timeConfig}
        paginationResettingProps={['timeConfig']}
        leftHeader={leftHeader}
        defaultOrderBy="label"
        defaultOrderDirection="ASC"
      />
    </Fragment>
  );
}

function getTableData({ query, page, pageSize, orderBy, orderDirection, timeConfig }) {
  return getKubernetesNamespaces({
    pagination: {
      page,
      pageSize
    },
    order: {
      by: orderBy,
      direction: orderDirection
    },
    metrics: {
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
      return <EntityLink icon="lib_kubernetes_namespace" label={item.label} href$={getNamespaceDashboard(item.id)} />;
    }
  },
  {
    id: 'cluster',
    label: 'Cluster Name',
    getContent(item) {
      return item.clusterName;
    }
  },
  {
    id: 'pods',
    label: 'Pods',
    getContent(item) {
      return <EntityCounter icon="lib_kubernetes_pod" count={get(item, ['metrics', 'pods'])} />;
    }
  },
  {
    id: 'service',
    label: 'Services',
    getContent(item) {
      return <EntityCounter icon="lib_kubernetes_service" count={get(item, ['metrics', 'services'])} />;
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
