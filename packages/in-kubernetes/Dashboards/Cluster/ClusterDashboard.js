/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { get } from 'lodash';
import React from 'react';

import { themes } from '@instana/design-tokens';

import { beeInstanaInfraMetricsEnabled, beeinstanaInfraMetricsWithTimeshiftEnabled } from 'in-services/featureFlags';
import AnalyzeCallsButton, { getFilters } from 'in-kubernetes/Dashboards/commonComponents/AnalyzeCallsButton';
import RenderButtonLineSecondary from 'in-kubernetes/Dashboards/commonComponents/RenderButtonLineSecondary';
import DashboardButtonLine from 'in-kubernetes/Dashboards/commonComponents/DashboardButtonLine';
import TypesBadgeList from 'in-kubernetes/Dashboards/commonComponents/TypesBadgeList';
import getKubernetesCluster from 'in-kubernetes/subscriptions/getKubernetesCluster';
import { clusterBadgeName, isOpenshift } from 'in-kubernetes/clusterDistributions';
import CenterAlignmentColumn from 'in-components/layout/CenterAlignmentColumn';
import { clusterId as matrixClusterId } from 'in-kubernetes/navigation/matrix';
import { DESTINATION } from 'in-components/QueryBuilder/tagFilter/entities';
import TimeShiftDropdown from 'in-components/TimeShift/TimeShiftDropdown';
import EntityWithTypeAndIcon from 'in-components/EntityWithTypeAndIcon';
import { clusterDashboard } from 'in-kubernetes/navigation/paths';
import TabView from 'in-components/LocationAwareTabView/TabView';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { productAreas } from 'in-services/tracking/productAreas';
import EntityVersionList from 'in-components/EntityVersionList';
import Breadcrumbs from 'in-components/breadcrumb/Breadcrumbs';
import tabs from 'in-kubernetes/Dashboards/Cluster/tabs/index';
import { ClusterBreadcrumbs } from 'in-kubernetes/breadcrumbs';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import { useKubernetesTracker } from 'in-kubernetes/tracker';
import DashboardHeader from 'in-components/DashboardHeader';
import { createGroupBy } from 'in-analyze/navigation/paths';
import { getTimeShiftLabel } from 'in-stores/time/shifting';
import { pageNames } from 'in-services/tracking/pageNames';
import BadgeList from 'in-components/BadgeList/BadgeList';
import { getTimeConfig } from 'in-stores/time/config';
import { plugins } from 'in-forge/constants';
import Footer from 'in-components/Footer';
import { t } from 'in-i18n';

export default function ClusterDashboard({ location }) {
  const props = {
    clusterId: getMatrixParameter(location, clusterDashboard, matrixClusterId),
    viewPath: clusterDashboard,
    timeConfig: getTimeConfig(location)
  };

  const { k8sTabChange, kubernetesTimeShiftSelectTracker } = useKubernetesTracker();

  return (
    <>
      <ViewTrackingMeta
        data={{
          productArea: productAreas.kubernetes,
          pageRootName: pageNames.cluster_summary
        }}
      />

      <Breadcrumbs items={ClusterBreadcrumbs(props)} />

      <TabView
        result$={getKubernetesCluster({
          id: props.clusterId,
          timeConfig: props.timeConfig
        })}
        HeaderComponent={props => (
          <Header {...props} kubernetesTimeShiftSelectTracker={kubernetesTimeShiftSelectTracker} />
        )}
        location={location}
        tabs={tabs}
        tabChangeTracker={e =>
          k8sTabChange({
            ...e,
            dashboard: 'cluster',
            path: location.pathname
          })
        }
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
      renderButtonLineSecondary={renderButtonLineSecondary}
      renderMetaInformation={RenderMetaInformation}
    />
  );
}

function renderButtonLineSecondary({ timeConfig, podId, kubernetesTimeShiftSelectTracker }) {
  return (
    <>
      {beeInstanaInfraMetricsEnabled && beeinstanaInfraMetricsWithTimeshiftEnabled && (
        <TimeShiftDropdown
          onChange={offset =>
            kubernetesTimeShiftSelectTracker({
              area: 'pod',
              offset: getTimeShiftLabel({ offset: offset }),
              windowSize: timeConfig.windowSize,
              autoRefresh: timeConfig.autoRefresh
            })
          }
        />
      )}
      <RenderButtonLineSecondary timeConfig={timeConfig} snapshotId={podId} />
    </>
  );
}

function renderButtonLine({ clusterId, timeConfig, result }) {
  const clusterNameSuffix = ' (cluster)';
  const clusterLabel = result?.data.label;
  const clusterName = clusterLabel.endsWith(clusterNameSuffix)
    ? clusterLabel.replace(clusterNameSuffix, '')
    : clusterLabel;

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
        groupBy={createGroupBy('kubernetes.namespace.name', DESTINATION)}
        timeConfig={timeConfig}
      />
    </>
  );
}

function RenderMetaInformation({ result }) {
  const version = get(result, ['data', 'version']);
  const clusterDistribution = get(result, ['data', 'clusterDistribution'], 'kubernetes');
  const clusterManagement = get(result, ['data', 'clusterManagement']);
  return (
    <>
      {version && <BadgeList type={version} getColor={() => themes.default.ids.color.option.neutral['700']} />}
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
