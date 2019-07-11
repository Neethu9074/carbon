import React, { Fragment } from 'react';
import { get, find } from 'lodash';

import KubernetesNoDataNotification from 'in-kubernetes/lists/components/KubernetesNoDataNotification';
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import SeverityAwareEntityLink from 'in-components/tables/sharedComponents/SeverityAwareEntityLink';
import EntityHealthIndicator from 'in-new-components/EntityHealthIndicator/EntityHealthIndicator';
import HealthIndicatorPresenter from 'in-new-components/health/HealthIndicatorPresenter';
import getKubernetesNamespaces from 'in-subscription/kubernetes/getKubernetesNamespaces';
import { namespaceList, getNamespaceDashboard } from 'in-kubernetes/navigation/paths';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import EntityCounter from 'in-components/tables/sharedComponents/EntityCounter';
import WithEmptyStateFallback from 'in-new-components/WithEmptyStateFallback';
import { timeConfig$ } from 'in-stores/time/config';
import Footer from 'in-new-components/Footer';
import connectTo from 'in-hoc/connectTo';
import Title from 'in-components/Title';

const pathSegment = namespaceList;
const matrixPrefix = 'k8Namespace.';

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

const ServerTableWithUrlState = createServerTableWithUrlState({
  paginationResettingUrlParameters: [...timeConfigUrlParameters],
  columnDefinitions,
  defaultOrderBy: 'label',
  defaultOrderDirection: 'ASC',
  pathSegment,
  matrixPrefix
});

export default connectTo(
  {
    timeConfig: timeConfig$
  },
  function NamespaceList({ timeConfig }) {
    return (
      <Fragment>
        <Title title="Namespaces" />

        <WithEmptyStateFallback
          getHasDataToRender={getHasDataToRender}
          FallbackComponent={<KubernetesNoDataNotification icon="lib_kubernetes_namespace" />}
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
                    item => get(item, ['namespace', 'distributionType'], 'Kubernetes') === 'OpenShift'
                  )
                )
                  return true;
                else return columnDefinition.id !== 'deploymentConfigs';
              };
            }}
            timeConfig={timeConfig}
          />
        </WithEmptyStateFallback>

        <Footer />
      </Fragment>
    );
  }
);

function getTableData(params) {
  return getKubernetesNamespacesSubscribeEvent(params);
}

function getHasDataToRender() {
  return timeConfig$
    .flatMap(timeConfig => getKubernetesNamespacesSubscribeEvent({ timeConfig }))
    .map(result => !result.data || result.data.totalHits > 0);
}

function getKubernetesNamespacesSubscribeEvent({
  query = '',
  page = 1,
  pageSize = 20,
  orderBy = 'label',
  orderDirection = 'ASC',
  timeConfig
}) {
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
