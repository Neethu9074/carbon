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
import ViewTrackingMeta from 'in-services/tracking/ViewTrackingMeta';
import { isOpenshift } from 'in-kubernetes/clusterDistributions';
import { timeConfig$ } from 'in-stores/time/config';
import Card from 'in-new-components/Card';
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
    id: 'services',
    label: 'Services',
    getContent(item) {
      return <EntityCounter icon="lib_kubernetes_service" count={item.services} />;
    }
  },
  {
    id: 'pods',
    label: 'Pods',
    getContent({ workloads }) {
      return <EntityCounter icon="lib_kubernetes_pod" count={workloads.pods} />;
    }
  },
  {
    id: 'deployments',
    label: 'Deployments',
    getContent({ workloads }) {
      return <EntityCounter icon="lib_kubernetes_workload" count={workloads.deployments} />;
    }
  },
  {
    id: 'deploymentConfigs',
    label: 'Deployment Configs',
    getContent({ workloads }) {
      return <EntityCounter icon="lib_kubernetes_workload" count={workloads.deploymentConfigs} />;
    }
  },
  {
    id: 'daemonSets',
    label: 'DaemonSets',
    getContent({ workloads }) {
      return <EntityCounter icon="lib_kubernetes_workload" count={workloads.daemonSets} />;
    }
  },
  {
    id: 'statefulSets',
    label: 'StatefulSets',
    getContent({ workloads }) {
      return <EntityCounter icon="lib_kubernetes_workload" count={workloads.statefulSets} />;
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
          inContentArea
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
        <ViewTrackingMeta
          data={{
            productArea: 'Kubernetes',
            pageRootName: 'Kubernetes Namespaces'
          }}
        />

        <WithEmptyStateFallback
          getHasDataToRender={getHasDataToRender}
          FallbackComponent={<KubernetesNoDataNotification icon="lib_kubernetes_namespace" />}
        >
          <Card>
            <ServerTableWithUrlState
              get={getTableData}
              filterColumnDefinitions={createColumnFilter}
              timeConfig={timeConfig}
            />
          </Card>
        </WithEmptyStateFallback>
      </Fragment>
    );
  }
);

function createColumnFilter({ result }) {
  const items = (result.data && result.data.items) || [];
  const anyOpenshift = Boolean(
    find(items, item => isOpenshift(get(item, ['namespace', 'clusterDistribution'], 'kubernetes')))
  );

  return ({ id }) => {
    if (anyOpenshift) {
      return true;
    }
    return id !== 'deploymentConfigs';
  };
}

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
