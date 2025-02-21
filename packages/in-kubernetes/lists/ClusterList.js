/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { get, find } from 'lodash';
import React from 'react';

import { CarbonIconButton, SvgIcon, TableEntityCounter } from '@instana/components';

import KubernetesNoDataNotification from 'in-kubernetes/lists/components/KubernetesNoDataNotification';
import { getKubernetesClustersWithDefaults } from 'in-kubernetes/subscriptions/getKubernetesClusters';
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import SeverityAwareEntityLink from 'in-components/tables/sharedComponents/SeverityAwareEntityLink';
import EntityHealthIndicator from 'in-components/EntityHealthIndicator/EntityHealthIndicator';
import HealthIndicatorPresenter from 'in-components/health/HealthIndicatorPresenter';
import { clusterList, useClusterDashboard } from 'in-kubernetes/navigation/paths';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import { kubernetesCloudNativeExperience } from 'in-services/featureFlags';
import { clusterListFullyQualified } from 'in-kubernetes/navigation/paths';
import WithEmptyStateFallback from 'in-components/WithEmptyStateFallback';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { isOpenshift } from 'in-kubernetes/clusterDistributions';
import { productAreas } from 'in-services/tracking/productAreas';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import { pageNames } from 'in-services/tracking/pageNames';
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
      return <ClusterLink {...item} />;
    }
  },
  {
    id: 'namespaces',
    label: t('in-kubernetes:namespaces'),
    getContent(item) {
      return <TableEntityCounter icon="lib_infra_kubernetesNamespace" count={item.namespaces} />;
    }
  },
  {
    id: 'nodes',
    label: t('in-kubernetes:nodes'),
    getContent(item) {
      return <TableEntityCounter icon="lib_kubernetes_node" count={item.nodes} />;
    }
  },
  {
    id: 'services',
    label: t('in-kubernetes:services'),
    getContent(item) {
      return <TableEntityCounter icon="lib_infra_kubernetesService" count={item.services} />;
    }
  },
  {
    id: 'workloads.pods',
    label: t('in-kubernetes:pods'),
    getContent({ workloads }) {
      return <TableEntityCounter icon="lib_kubernetes_pod" count={workloads.pods} />;
    }
  },
  {
    id: 'workloads.deployments',
    label: t('in-kubernetes:deployments'),
    getContent({ workloads }) {
      return <TableEntityCounter icon="lib_infra_kubernetesDeployment" count={workloads.deployments} />;
    }
  },
  {
    id: 'workloads.deploymentConfigs',
    label: t('in-kubernetes:deploymentConfigs'),
    getContent({ workloads }) {
      return <TableEntityCounter icon="lib_infra_kubernetesDeployment" count={workloads.deploymentConfigs} />;
    }
  },
  {
    id: 'workloads.daemonSets',
    label: t('in-kubernetes:daemonSets'),
    getContent({ workloads }) {
      return <TableEntityCounter icon="lib_infra_kubernetesDaemonSet" count={workloads.daemonSets} />;
    }
  },
  {
    id: 'workloads.statefulSets',
    label: t('in-kubernetes:statefulSets'),
    getContent({ workloads }) {
      return <TableEntityCounter icon="lib_infra_kubernetesStatefulSet" count={workloads.statefulSets} />;
    }
  },
  {
    id: 'cronJobs',
    label: t('in-kubernetes:cronJobs'),
    getContent(item) {
      return <TableEntityCounter icon="lib_infra_kubernetesCronJob" count={item.cronJobs} />;
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
    const { createHrefToPath } = useNavigation();

    return (
      <>
        <Title title={t('in-kubernetes:clusters')} />
        <ViewTrackingMeta
          data={{
            productArea: productAreas.kubernetes,
            pageRootName: pageNames.kubernetes_clusters
          }}
        />

        <WithEmptyStateFallback
          getHasDataToRender={getHasDataToRender}
          FallbackComponent={() => <KubernetesNoDataNotification icon="lib_kubernetes_cluster" />}
        >
          <div className={locals.table}>
            <ServerTableWithUrlState
              get={getTableData}
              filterColumnDefinitions={createColumnFilter}
              timeConfig={timeConfig}
              toolBarContent={
                kubernetesCloudNativeExperience ? (
                  <CarbonIconButton
                    align="left"
                    kind="ghost"
                    size="lg"
                    label={t('in-kubernetes:cloudNative.switchToGridView')}
                    href={createHrefToPath(`${clusterListFullyQualified}/grid`)}
                  >
                    <SvgIcon type="lib_views_grid" size="s" />
                  </CarbonIconButton>
                ) : null
              }
            />
          </div>
        </WithEmptyStateFallback>
      </>
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
        <>
          <span className={locals.clusterManagementLabel}>Managed by {clusterManagement.fullName}</span>
          <SvgIcon className={locals.clusterManagementIcon} type={`lib_${clusterManagement.shortName}`} />
        </>
      </div>
    );
  }
  return null;
}

function ClusterLink(item) {
  const clusterDistribution = get(item, ['cluster', 'clusterDistribution'], 'kubernetes');
  const clusterManagement = get(item, ['cluster', 'clusterManagement']);
  const clusterLabel = get(item, ['cluster', 'label']);
  const clusterIcon = `lib_${clusterDistribution}`;

  const clusterHref = useClusterDashboard(get(item, ['cluster', 'id']));

  return (
    <SeverityAwareEntityLink
      icon={clusterIcon}
      label={clusterLabel}
      href={clusterHref}
      severity={item.entityHealthInfo.maxSeverity}
      subscriptComponent={<ClusterManagedByWithIcon clusterManagement={clusterManagement} />}
    />
  );
}
