import React, { Fragment } from 'react';
import { compose } from 'recompose';
import { get, find } from 'lodash';

import ServerTableWithUrlBoundState from 'in-components/tables/ServerTable/ServerTableWithUrlBoundState';
import SeverityAwareEntityLink from 'in-components/tables/sharedComponents/SeverityAwareEntityLink';
import EntityHealthIndicator from 'in-new-components/EntityHealthIndicator/EntityHealthIndicator';
import HealthIndicatorPresenter from 'in-new-components/health/HealthIndicatorPresenter';
import getKubernetesNamespaces from 'in-subscription/kubernetes/getKubernetesNamespaces';
import { namespaceList, getNamespaceDashboard } from 'in-kubernetes/navigation/paths';
import EntityCounter from 'in-components/tables/sharedComponents/EntityCounter';
import { timeConfig$ } from 'in-stores/time/config';
import Title from 'in-components/Title';
import connect from 'in-hoc/connectTo';

const matrixPrefix = 'k8Namespace.';

export default compose(connect({ timeConfig: timeConfig$ }))(NamespaceList);

function NamespaceList({ timeConfig }) {
  return (
    <Fragment>
      <Title title="Namespaces" />

      <ServerTableWithUrlBoundState
        get={getTableData}
        pathSegment={namespaceList}
        matrixPrefix={matrixPrefix}
        columnDefinitions={columnDefinitions}
        filterColumnDefinitionsByResult={result => {
          return columnDefinition => {
            if (
              result.data &&
              result.data.items &&
              find(
                result.data.items,
                item => get(item, ['namespace', 'distributionType'], 'Kubernetes') === 'OpenShift'
              )
            )
              return true;
            else return columnDefinition.id !== 'deploymentConfigs';
          };
        }}
        timeConfig={timeConfig}
        paginationResettingProps={['timeConfig']}
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
    getContent(item) {
      return (
        <SeverityAwareEntityLink
          icon="lib_kubernetes_namespace"
          label={get(item, ['namespace', 'label'])}
          href$={getNamespaceDashboard(get(item, ['namespace', 'id']))}
          severity={item.entityHealthInfo.maxSeverity}
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
    id: 'deploymentConfigs',
    label: 'Deployment Configs',
    getContent(item) {
      return <EntityCounter icon="lib_kubernetes_workload" count={item.deploymentConfigs} />;
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
    id: 'health',
    label: 'Health',
    getContent(item, { timeConfig }) {
      return (
        <EntityHealthIndicator
          openIssues={item.entityHealthInfo.openIssues.length}
          maxSeverity={item.entityHealthInfo.maxSeverity}
          IndicatorPresenter={HealthIndicatorPresenter}
          timeConfig={timeConfig}
          snapshotId={item.namespace.id}
        />
      );
    }
  }
];
