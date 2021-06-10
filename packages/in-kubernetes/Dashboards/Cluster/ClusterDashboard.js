/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { get } from 'lodash';
import React from 'react';

import AnalyzeCallsButton, { getFilters } from 'in-kubernetes/Dashboards/commonComponents/AnalyzeCallsButton';
import DashboardButtonLine from 'in-kubernetes/Dashboards/commonComponents/DashboardButtonLine';
import TypesBadgeList from 'in-kubernetes/Dashboards/commonComponents/TypesBadgeList';
import getKubernetesCluster from 'in-subscription/kubernetes/getKubernetesCluster';
import { isOpenshift, clusterBadgeName } from 'in-kubernetes/clusterDistributions';
import { clusterId as matrixClusterId } from 'in-kubernetes/navigation/matrix';
import CenterAlignmentColumn from 'in-components/layout/CenterAlignmentColumn';
import { DESTINATION } from 'in-components/QueryBuilder/tagFilter/entities';
import EntityWithTypeAndIcon from 'in-components/EntityWithTypeAndIcon';
import ViewTrackingMeta from 'in-services/tracking/ViewTrackingMeta';
import { clusterDashboard } from 'in-kubernetes/navigation/paths';
import TabView from 'in-components/LocationAwareTabView/TabView';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import EntityVersionList from 'in-components/EntityVersionList';
import Breadcrumbs from 'in-components/breadcrumb/Breadcrumbs';
import { ClusterBreadcrumbs } from 'in-kubernetes/breadcrumbs';
import tabs from 'in-kubernetes/Dashboards/Cluster/tabs/index';
import DashboardHeader from 'in-components/DashboardHeader';
import { createGroupBy } from 'in-analyze/navigation/paths';
import BadgeList from 'in-components/BadgeList/BadgeList';
import { clusterTabChange } from 'in-kubernetes/tracker';
import { getTimeConfig } from 'in-stores/time/config';
import { plugins } from 'in-forge/constants';
import Footer from 'in-components/Footer';
import theme from 'in-themes';
import { t } from 'in-i18n';

export default function ClusterDashboard({ location }) {
  const props = {
    clusterId: getMatrixParameter(location, clusterDashboard, matrixClusterId),
    viewPath: clusterDashboard,
    timeConfig: getTimeConfig(location)
  };

  return (
    <>
      <ViewTrackingMeta
        data={{
          productArea: 'Kubernetes',
          pageRootName: t('in-kubernetes:kubernetesPageRootName', {
            objectType: t('in-kubernetes:dashboards.cluster')
          })
        }}
      />

      <Breadcrumbs items={ClusterBreadcrumbs(props)} />

      <TabView
        result$={getKubernetesCluster({
          id: props.clusterId,
          timeConfig: props.timeConfig
        })}
        HeaderComponent={Header}
        location={location}
        tabs={tabs}
        tabChangeTracker={clusterTabChange}
        filterTabByResult={result => {
          return tab => {
            if (isOpenshift(get(result, ['data', 'clusterDistribution'], 'kubernetes'))) return true;
            else return !tab.path.endsWith('/deploymentconfigs');
          };
        }}
        props={props}
        renderErrors={errors => (
          <CenterAlignmentColumn>
            <EntityVersionList
              plugin={plugins.kubernetesCluster}
              snapshotId={props.clusterId}
              timeConfig={props.timeConfig}
              errors={errors}
            />
          </CenterAlignmentColumn>
        )}
      />

      <Footer />
    </>
  );
}

function Header(props) {
  const clusterDistribution = get(props, ['result', 'data', 'clusterDistribution'], 'kubernetes');

  return (
    <DashboardHeader
      {...props}
      title={t('in-kubernetes:dashboards.kubernetesCluster')}
      icon={`lib_${clusterDistribution}`}
      label={get(props.result, ['data', 'label'])}
      renderButtonLine={renderButtonLine}
      renderMetaInformation={renderMetaInformation}
    />
  );
}

function renderButtonLine({ clusterId, timeConfig, result }) {
  let clusterName = result.data?.label;
  const clusterNameSuffix = ' (cluster)';
  if (clusterName.endsWith(clusterNameSuffix)) {
    clusterName = clusterName.replace(clusterNameSuffix, '');
  }

  return (
    <>
      <DashboardButtonLine
        snapshotId={clusterId}
        plugin={plugins.kubernetesCluster}
        timeConfig={timeConfig}
        tagFilters={getFilters({ clusterName })}
      />
      <AnalyzeCallsButton
        clusterName={get(result, ['data', 'label'], '')}
        groupBy={createGroupBy('kubernetes.namespace', DESTINATION)}
        timeConfig={timeConfig}
      />
    </>
  );
}

function renderMetaInformation({ result }) {
  const version = get(result, ['data', 'version']);
  const clusterDistribution = get(result, ['data', 'clusterDistribution'], 'kubernetes');
  const clusterManagement = get(result, ['data', 'clusterManagement']);

  return (
    <>
      {version && <BadgeList type={version} getColor={() => theme.lib.colors.N700Medium} />}
      <TypesBadgeList
        type={t('in-kubernetes:dashboards.clusterDistributionBadgeType', {
          clusterDistributionName: clusterBadgeName(clusterDistribution)
        })}
      />
      <ClusterManagedByWithIcon clusterManagement={clusterManagement} />
    </>
  );
}

function ClusterManagedByWithIcon({ clusterManagement }) {
  if (clusterManagement && clusterManagement.shortName !== 'none') {
    return (
      <EntityWithTypeAndIcon
        iconType={`lib_${clusterManagement.shortName}`}
        label={t('in-kubernetes:dashboards.managedby', {
          name: clusterManagement.fullName
        })}
      />
    );
  }
  return null;
}
