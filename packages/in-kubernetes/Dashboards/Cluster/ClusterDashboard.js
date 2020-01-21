import theme from 'in-themes';
import { get } from 'lodash';
import React from 'react';

import DashboardButtonLine from 'in-kubernetes/Dashboards/commonComponents/DashboardButtonLine';
import AnalyzeCallsButton from 'in-kubernetes/Dashboards/commonComponents/AnalyzeCallsButton';
import TypesBadgeList from 'in-kubernetes/Dashboards/commonComponents/TypesBadgeList';
import getKubernetesCluster from 'in-subscription/kubernetes/getKubernetesCluster';
import { isOpenshift, clusterBadgeName } from 'in-kubernetes/clusterDistributions';
import TechnologyLabelWithIcon from 'in-new-components/TechnologyLabelWithIcon';
import { clusterId as matrixClusterId } from 'in-kubernetes/navigation/matrix';
import CenterAlignmentColumn from 'in-components/layout/CenterAlignmentColumn';
import TabView from 'in-new-components/LocationAwareTabView/TabView';
import EntityVersionList from 'in-new-components/EntityVersionList';
import { clusterDashboard } from 'in-kubernetes/navigation/paths';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import DashboardHeader from 'in-new-components/DashboardHeader';
import Breadcrumbs from 'in-components/breadcrumb/Breadcrumbs';
import { ClusterBreadcrumbs } from 'in-kubernetes/breadcrumbs';
import tabs from 'in-kubernetes/Dashboards/Cluster/tabs/index';
import { capitalize } from 'in-services/formatters/string';
import BadgeList from 'in-new-components/Badge/BadgeList';
import { clusterTabChange } from 'in-kubernetes/tracker';
import icons from 'in-components/SvgIcon/registry.json';
import { getTimeConfig } from 'in-stores/time/config';
import Footer from 'in-new-components/Footer';
import { plugins } from 'in-forge/constants';

export default function ClusterDashboard({ location }) {
  const props = {
    clusterId: getMatrixParameter(location, clusterDashboard, matrixClusterId),
    viewPath: clusterDashboard,
    timeConfig: getTimeConfig(location)
  };

  return (
    <>
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
            else return tab.label !== 'Deployment Configs';
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
      title="Cluster"
      icon={`lib_${clusterDistribution}`}
      label={get(props.result, ['data', 'label'])}
      renderButtonLine={renderButtonLine}
      renderMetaInformation={renderMetaInformation}
    />
  );
}

function renderButtonLine({ clusterId, timeConfig, result }) {
  return (
    <>
      <DashboardButtonLine snapshotId={clusterId} timeConfig={timeConfig} />
      <AnalyzeCallsButton
        clusterName={get(result, ['data', 'label'], '')}
        groupByTag={{ name: 'kubernetes.namespace' }}
        timeConfig={timeConfig}
      />
    </>
  );
}

function renderMetaInformation({ result }) {
  const version = get(result, ['data', 'version']);
  const clusterDistribution = get(result, ['data', 'clusterDistribution'], 'kubernetes');
  const clusterManagedBy = get(result, ['data', 'clusterManagedBy']);

  return (
    <>
      {version && <BadgeList type={version} getColor={() => theme.lib.colors.N700Medium} />}
      <TypesBadgeList type={`${clusterBadgeName(clusterDistribution)} Cluster`} />
      <ClusterManagedByWithIcon clusterManagedBy={clusterManagedBy} />
    </>
  );
}

function ClusterManagedByWithIcon({ clusterManagedBy }) {
  if (clusterManagedBy && clusterManagedBy !== 'none') {
    const iconPath = icons[`lib_${clusterManagedBy}`].path;
    return <TechnologyLabelWithIcon path={iconPath} label={`Managed by ${capitalize(clusterManagedBy)}`} />;
  }
  return null;
}
