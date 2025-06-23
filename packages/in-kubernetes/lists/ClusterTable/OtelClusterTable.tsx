/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useEffect } from 'react';
import { get, find } from 'lodash';

import {
  KubernetesClusterListItem,
  KubernetesClusterManagement,
  TimeConfig,
  Result,
  PaginatedResult
} from '@instana/types';
import { CarbonIconButton, SvgIcon, TableEntityCounter } from '@instana/components';

//@ts-expect-error TS migration
import KubernetesNoDataNotification from 'in-kubernetes/lists/components/KubernetesNoDataNotification';
//@ts-expect-error TS migration
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
//@ts-expect-error TS migration
import SeverityAwareEntityLink from 'in-components/tables/sharedComponents/SeverityAwareEntityLink';
import {
  getOtelKubernetesClustersWithDefaults,
  QueryParams
} from 'in-kubernetes/subscriptions/getOtelKubernetesClusters';
//@ts-expect-error TS migration
import EntityHealthIndicator from 'in-components/EntityHealthIndicator/EntityHealthIndicator';
import { kubernetesCloudNativeExperience, openTelemetryKubernetesUnifiedViewEnabled } from 'in-services/featureFlags';
import { clusterList, useOtelClusterDashboard, clusterOtelListFullyQualified } from 'in-kubernetes/navigation/paths';
//@ts-expect-error TS migration
import { isOpenshift } from 'in-kubernetes/clusterDistributions';
import { urlParameters as timeConfigUrlParameters, timeConfig$ } from 'in-stores/time/config';
import HealthIndicatorPresenter from 'in-components/health/HealthIndicatorPresenter';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
//@ts-expect-error TS migration
import connectTo from 'in-hoc/connectTo';
import { productAreas } from 'in-services/tracking/productAreas';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import { useKubernetesTracker } from 'in-kubernetes/tracker';
import { pageNames } from 'in-services/tracking/pageNames';
import useTimeConfig from 'in-hooks/useTimeConfig';
import Title from 'in-components/Title';
import { t } from 'in-i18n';

import locals from './ClusterTable.mless';

const pathSegment = clusterList;
const matrixPrefix = 'k8Cluster.';

const columnDefinitions = [
  {
    id: 'name',
    label: t('in-kubernetes:name'),
    getContent(item: KubernetesClusterListItem) {
      return <ClusterLink {...item} />;
    }
  },
  {
    id: 'nodes',
    label: t('in-kubernetes:nodes'),
    getContent(item: KubernetesClusterListItem) {
      return <TableEntityCounter icon="lib_kubernetes_node" count={item.nodes} />;
    }
  },
  {
    id: 'workloads.pods',
    label: t('in-kubernetes:pods'),
    getContent({ workloads }: KubernetesClusterListItem) {
      return <TableEntityCounter icon="lib_kubernetes_pod" count={workloads.pods} />;
    }
  },
  {
    id: 'health',
    label: t('in-kubernetes:health'),
    getContent(item: KubernetesClusterListItem, { timeConfig }: { timeConfig: TimeConfig }) {
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

export default function OtelClusterTable() {
  const { createHrefToPath } = useNavigation();
  const { kubernetesViewModeToggled } = useKubernetesTracker();
  const [hasData, setHasData] = React.useState<boolean | null>(null);
  const timeConfig = useTimeConfig();

  useEffect(() => {
    const sub = getHasDataToRender().subscribe(setHasData);
    return () => sub.dispose();
  }, [timeConfig]);

  if (hasData === null) {
    // Optionally show a loading spinner here
    return null;
  }

  if (!hasData) {
    return <KubernetesNoDataNotification icon="lib_kubernetes_cluster" />;
  }

  return (
    <>
      <Title title={t('in-kubernetes:clusters')} />
      <ViewTrackingMeta
        data={{
          productArea: productAreas.kubernetes,
          pageRootName: pageNames.kubernetes_clusters
        }}
      />
      <div className={locals.table}>
        {openTelemetryKubernetesUnifiedViewEnabled && (
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
                  onClick={() => {
                    kubernetesViewModeToggled({
                      switchedToView: 'card',
                      tab: 'cluster'
                    });
                    window.location.href = createHrefToPath(clusterOtelListFullyQualified);
                  }}
                >
                  <SvgIcon type="lib_views_grid" size="s" />
                </CarbonIconButton>
              ) : null
            }
          />
        )}
      </div>
    </>
  );
}

function createColumnFilter({ result }: { result: Result<PaginatedResult<KubernetesClusterListItem>> }) {
  const items = result.data?.items || [];
  const anyOpenshift = Boolean(
    find(items, (item: KubernetesClusterListItem) =>
      isOpenshift(get(item, ['cluster', 'clusterDistribution'], 'kubernetes'))
    )
  );

  return ({ id }: { id: string }) => {
    if (anyOpenshift) {
      return true;
    }
    return id !== 'workloads.deploymentConfigs';
  };
}

function getTableData(params: QueryParams) {
  return getOtelKubernetesClustersWithDefaults(params);
}

function getHasDataToRender() {
  return timeConfig$
    .flatMap((timeConfig: TimeConfig) => getOtelKubernetesClustersWithDefaults({ timeConfig }))
    .map((result: any) => !result.data || result.data.totalHits > 0);
}
const managedby: string = t('in-kubernetes:dashboards.managedby');

function ClusterManagedByWithIcon({ clusterManagement }: { clusterManagement?: KubernetesClusterManagement }) {
  if (!clusterManagement || clusterManagement.shortName === 'none' || clusterManagement?.shortName === '') {
    return null;
  }
  return (
    <div className={locals.clusterManagement}>
      <span className={locals.clusterManagementLabel}>
        {managedby} {clusterManagement.fullName}
      </span>
      <SvgIcon className={locals.clusterManagementIcon} type={`lib_${clusterManagement.shortName}`} />
    </div>
  );
}

function ClusterLink(item: KubernetesClusterListItem) {
  const clusterDistribution = get(item, ['cluster', 'clusterDistribution'], 'kubernetes');
  const clusterManagement = get(item, ['cluster', 'clusterManagement']);
  const clusterLabel = get(item, ['cluster', 'label']);
  const clusterIcon = `lib_${clusterDistribution}`;

  const clusterHref = useOtelClusterDashboard(get(item, ['cluster', 'id']));

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
