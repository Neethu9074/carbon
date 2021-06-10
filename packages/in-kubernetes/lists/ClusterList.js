/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';
import { get, find } from 'lodash';

import { SvgIcon } from '@instana/components';
import { Card } from '@instana/components';

import KubernetesNoDataNotification from 'in-kubernetes/lists/components/KubernetesNoDataNotification';
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import { getKubernetesClustersWithDefaults } from 'in-subscription/kubernetes/getKubernetesClusters';
import SeverityAwareEntityLink from 'in-components/tables/sharedComponents/SeverityAwareEntityLink';
import EntityHealthIndicator from 'in-components/EntityHealthIndicator/EntityHealthIndicator';
import HealthIndicatorPresenter from 'in-components/health/HealthIndicatorPresenter';
import { clusterList, getClusterDashboard } from 'in-kubernetes/navigation/paths';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import EntityCounter from 'in-components/tables/sharedComponents/EntityCounter';
import WithEmptyStateFallback from 'in-components/WithEmptyStateFallback';
import ViewTrackingMeta from 'in-services/tracking/ViewTrackingMeta';
import { isOpenshift } from 'in-kubernetes/clusterDistributions';
import { timeConfig$ } from 'in-stores/time/config';
import connectTo from 'in-hoc/connectTo';
import Title from 'in-components/Title';
import { t } from 'in-i18n';

import locals from './ClusterList.mless';

const pathSegment = clusterList;
const matrixPrefix = 'k8Cluster.';

const columnDefinitions = [
  {
    id: 'name',
    label: t('in-kubernetes:name'),
    getContent(item) {
      const clusterDistribution = get(item, ['cluster', 'clusterDistribution'], 'kubernetes');
      const clusterIcon = `lib_${clusterDistribution}`;
      const clusterManagement = get(item, ['cluster', 'clusterManagement']);
      return (
        <SeverityAwareEntityLink
          icon={clusterIcon}
          label={get(item, ['cluster', 'label'])}
          href$={getClusterDashboard(get(item, ['cluster', 'id']))}
          severity={item.entityHealthInfo.maxSeverity}
          subscriptComponent={<ClusterManagedByWithIcon clusterManagement={clusterManagement} />}
        />
      );
    }
  },
  {
    id: 'namespaces',
    label: t('in-kubernetes:namespaces'),
    getContent(item) {
      return <EntityCounter icon="lib_kubernetes_namespace" count={item.namespaces} />;
    }
  },
  {
    id: 'nodes',
    label: t('in-kubernetes:nodes'),
    getContent(item) {
      return <EntityCounter icon="lib_kubernetes_node" count={item.nodes} />;
    }
  },
  {
    id: 'services',
    label: t('in-kubernetes:services'),
    getContent(item) {
      return <EntityCounter icon="lib_kubernetes_service" count={item.services} />;
    }
  },
  {
    id: 'workloads.pods',
    label: t('in-kubernetes:pods'),
    getContent({ workloads }) {
      return <EntityCounter icon="lib_kubernetes_pod" count={workloads.pods} />;
    }
  },
  {
    id: 'workloads.deployments',
    label: t('in-kubernetes:deployments'),
    getContent({ workloads }) {
      return <EntityCounter icon="lib_kubernetes_workload" count={workloads.deployments} />;
    }
  },
  {
    id: 'workloads.deploymentConfigs',
    label: t('in-kubernetes:deploymentConfigs'),
    getContent({ workloads }) {
      return <EntityCounter icon="lib_kubernetes_workload" count={workloads.deploymentConfigs} />;
    }
  },
  {
    id: 'workloads.daemonSets',
    label: t('in-kubernetes:daemonSets'),
    getContent({ workloads }) {
      return <EntityCounter icon="lib_kubernetes_workload" count={workloads.daemonSets} />;
    }
  },
  {
    id: 'workloads.statefulSets',
    label: t('in-kubernetes:statefulSets'),
    getContent({ workloads }) {
      return <EntityCounter icon="lib_kubernetes_workload" count={workloads.statefulSets} />;
    }
  },
  {
    id: 'cronJobs',
    label: t('in-kubernetes:cronJobs'),
    getContent(item) {
      return <EntityCounter icon="lib_kubernetes_workload" count={item.cronJobs} />;
    }
  },
  {
    id: 'health',
    label: t('in-kubernetes:health'),
    getContent(item, { timeConfig }) {
      return (
        <EntityHealthIndicator
          openIssues={item.entityHealthInfo.openIssues.length}
          maxSeverity={item.entityHealthInfo.maxSeverity}
          IndicatorPresenter={HealthIndicatorPresenter}
          timeConfig={timeConfig}
          snapshotId={item.cluster.id}
          inContentArea
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
        <Title title={t('in-kubernetes:clusters')} />
        <ViewTrackingMeta
          data={{
            productArea: 'Kubernetes',
            pageRootName: t('in-kubernetes:kubernetesPageRootName', {
              objectType: t('in-kubernetes:clusters')
            })
          }}
        />

        <WithEmptyStateFallback
          getHasDataToRender={getHasDataToRender}
          FallbackComponent={<KubernetesNoDataNotification icon="lib_kubernetes_cluster" />}
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
    find(items, item => isOpenshift(get(item, ['cluster', 'clusterDistribution'], 'kubernetes')))
  );

  return ({ id }) => {
    if (anyOpenshift) {
      return true;
    }
    return id !== 'workloads.deploymentConfigs';
  };
}

function getTableData(params) {
  return getKubernetesClustersWithDefaults(params);
}

function getHasDataToRender() {
  return timeConfig$
    .flatMap(timeConfig => getKubernetesClustersWithDefaults({ timeConfig }))
    .map(result => !result.data || result.data.totalHits > 0);
}

function ClusterManagedByWithIcon({ clusterManagement }) {
  if (clusterManagement && clusterManagement.shortName !== 'none') {
    return (
      <div className={locals.clusterManagement}>
        <Fragment>
          <span className={locals.clusterManagementLabel}>Managed by {clusterManagement.fullName}</span>
          <SvgIcon className={locals.clusterManagementIcon} type={`lib_${clusterManagement.shortName}`} />
        </Fragment>
      </div>
    );
  }
  return null;
}
