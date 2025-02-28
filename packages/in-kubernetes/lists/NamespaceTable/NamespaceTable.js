/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { get, find } from 'lodash';
import React from 'react';

import { CarbonIconButton, SvgIcon, TableEntityCounter } from '@instana/components';

import { namespaceList, useNamespaceDashboard, namespaceListFullyQualified } from 'in-kubernetes/navigation/paths';
import KubernetesNoDataNotification from 'in-kubernetes/lists/components/KubernetesNoDataNotification';
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import SeverityAwareEntityLink from 'in-components/tables/sharedComponents/SeverityAwareEntityLink';
import EntityHealthIndicator from 'in-components/EntityHealthIndicator/EntityHealthIndicator';
import { urlParameters as timeConfigUrlParameters, timeConfig$ } from 'in-stores/time/config';
import getKubernetesNamespaces from 'in-kubernetes/subscriptions/getKubernetesNamespaces';
import HealthIndicatorPresenter from 'in-components/health/HealthIndicatorPresenter';
import { kubernetesCloudNativeExperience } from 'in-services/featureFlags';
import WithEmptyStateFallback from 'in-components/WithEmptyStateFallback';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { isOpenshift } from 'in-kubernetes/clusterDistributions';
import { productAreas } from 'in-services/tracking/productAreas';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import { useKubernetesTracker } from 'in-kubernetes/tracker';
import { pageNames } from 'in-services/tracking/pageNames';
import connectTo from 'in-hoc/connectTo';
import Title from 'in-components/Title';
import { t } from 'in-i18n';

import locals from './NamespaceTable.mless';

const pathSegment = namespaceList;
const matrixPrefix = 'k8Namespace.';

const columnDefinitions = [
  {
    id: 'label',
    label: t('in-kubernetes:name'),
    getContent(item) {
      return <NamespaceLink {...item} />;
    }
  },
  {
    id: 'clusterName',
    label: t('in-kubernetes:clusterName'),
    getContent(item) {
      return get(item, ['namespace', 'clusterName']);
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
    id: 'pods',
    label: t('in-kubernetes:pods'),
    getContent({ workloads }) {
      return <TableEntityCounter icon="lib_infra_kubernetesPod" count={workloads.pods} />;
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
    id: 'health',
    label: t('in-kubernetes:health'),
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
  function NamespaceTable({ timeConfig }) {
    const { createHrefToPath } = useNavigation();
    const { kubernetesViewModeToggled } = useKubernetesTracker();

    return (
      <>
        <Title title={t('in-kubernetes:namespaces')} />
        <ViewTrackingMeta
          data={{
            productArea: productAreas.kubernetes,
            pageRootName: pageNames.kubernetes_namespaces
          }}
        />

        <WithEmptyStateFallback
          getHasDataToRender={getHasDataToRender}
          FallbackComponent={() => <KubernetesNoDataNotification icon="lib_kubernetes_namespace" />}
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
                    label={t('in-kubernetes:cloudNative.switchToCardView')}
                    onClick={() =>
                      kubernetesViewModeToggled({
                        switchedToView: 'card',
                        tab: 'namespace'
                      })
                    }
                    href={createHrefToPath(`${namespaceListFullyQualified}`)}
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
    find(items, item => isOpenshift(get(item, ['namespace', 'clusterDistribution'], 'kubernetes')))
  );

  return ({ id }) => {
    if (anyOpenshift) {
      return true;
    }
    return id !== 'workloads.deploymentConfigs';
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

export function getKubernetesNamespacesSubscribeEvent({
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

function NamespaceLink(item) {
  const namespaceHref = useNamespaceDashboard(get(item, ['namespace', 'id']));

  return (
    <SeverityAwareEntityLink
      icon="lib_kubernetes_namespace"
      label={get(item, ['namespace', 'label'])}
      href={namespaceHref}
      severity={item.entityHealthInfo.maxSeverity}
    />
  );
}
