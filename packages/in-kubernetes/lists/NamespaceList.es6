import React, { Fragment } from 'react';
import { compose } from 'recompose';
import { get } from 'lodash';

import KubernetesEntityHealthIndicatorBehavior from 'in-kubernetes/components/KubernetesEntityHealthIndicatorBehavior';
import ServerTableWithUrlBoundState from 'in-components/tables/ServerTable/ServerTableWithUrlBoundState';
import SeverityAwareEntityLink from 'in-components/tables/sharedComponents/SeverityAwareEntityLink';
import HealthIndicatorPresenter from 'in-new-components/health/HealthIndicatorPresenter';
import getKubernetesNamespaces from 'in-subscription/kubernetes/getKubernetesNamespaces';
import { namespaceList, getNamespaceDashboard } from 'in-kubernetes/navigation/paths';
import EntityCounter from 'in-components/tables/sharedComponents/EntityCounter';
import KubernetesSeverity from 'in-kubernetes/components/KubernetesSeverity';
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
    getContent(item, { timeConfig }) {
      return (
        <KubernetesSeverity
          clusterId={get(item, ['namespace', 'id'])}
          timeConfig={timeConfig}
          renderLink={maxSeverity => (
            <SeverityAwareEntityLink
              icon="lib_kubernetes_namespace"
              label={get(item, ['namespace', 'label'])}
              href$={getNamespaceDashboard(get(item, ['namespace', 'id']))}
              severity={maxSeverity}
            />
          )}
        />
      );
    }
  },
  {
    id: 'clusterName',
    label: 'Cluster Name',
    getContent(item) {
      return get(item, ['namespace', 'clusterName']);
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
    id: 'services',
    label: 'Services',
    getContent(item) {
      return <EntityCounter icon="lib_kubernetes_service" count={item.services} />;
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
    id: 'maxSeverity',
    label: 'Health',
    sortable: false,
    getContent(item, { timeConfig }) {
      return (
        <KubernetesEntityHealthIndicatorBehavior
          namespaceId={item.namespace.id}
          IndicatorPresenter={HealthIndicatorPresenter}
          timeConfig={timeConfig}
          inContentArea
        />
      );
    }
  }
];
