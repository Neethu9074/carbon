import React, { Fragment } from 'react';
import { get } from 'lodash';

import KubernetesEntityHealthIndicatorBehavior from 'in-kubernetes/components/KubernetesEntityHealthIndicatorBehavior';
import HealthIndicatorButtonPresenter from 'in-new-components/health/HealthIndicatorButtonPresenter';
import KubernetesIndicator from 'in-kubernetes/Dashboards/commonComponents/KubernetesIndicator';
import TypesBadgeList from 'in-kubernetes/Dashboards/commonComponents/TypesBadgeList';
import getKubernetesCluster from 'in-subscription/kubernetes/getKubernetesCluster';
import BetaMarker, { KubernetesBetaMarker } from 'in-new-components/BetaMarker';
import { clusterId as matrixClusterId } from 'in-kubernetes/navigation/matrix';
import Breadcrumbs from 'in-sdk/components/dashboard/breadcrumb/Breadcrumbs';
import BasicDashboardHeader from 'in-new-components/BasicDashboardHeader';
import TabView from 'in-new-components/LocationAwareTabView/TabView';
import { clusterDashboard } from 'in-kubernetes/navigation/paths';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { ClusterBreadcrumbs } from 'in-kubernetes/breadcrumbs';
import tabs from 'in-kubernetes/Dashboards/Cluster/tabs/index';
import BadgeList from 'in-new-components/Badge/BadgeList';
import { getTimeConfig } from 'in-stores/time/config';
import theme from 'in-themes';

export default function ClusterDashboard({ location }) {
  const props = {
    clusterId: getMatrixParameter(location, clusterDashboard, matrixClusterId),
    viewPath: clusterDashboard,
    timeConfig: getTimeConfig(location)
  };

  return (
    <Fragment>
      <Breadcrumbs items={ClusterBreadcrumbs(props)} />

      <TabView
        result$={getKubernetesCluster({
          id: props.clusterId,
          timeConfig: props.timeConfig
        })}
        HeaderComponent={Header}
        location={location}
        tabs={tabs}
        props={props}
      />
      <BetaMarker title="Tech Preview">{KubernetesBetaMarker}</BetaMarker>
    </Fragment>
  );
}

function Header(props) {
  return (
    <BasicDashboardHeader
      title="Cluster"
      icon="lib_kubernetes_cluster"
      {...props}
      renderActions={Actions}
      renderSubTypes={SubTypes}
      getLabel={result => get(result, ['data', 'label'])}
    />
  );
}

function Actions({ clusterId, timeConfig }) {
  return (
    <Fragment>
      <KubernetesEntityHealthIndicatorBehavior
        showOkayOnNoIssues={false}
        IndicatorPresenter={HealthIndicatorButtonPresenter}
        clusterId={clusterId}
        timeConfig={timeConfig}
      />
    </Fragment>
  );
}

function SubTypes({ result }) {
  const version = get(result, ['data', 'version']);
  return (
    <Fragment>
      {version && <BadgeList type={version} getColor={() => theme.lib.colors.N700Medium} />}
      <TypesBadgeList type="K8s Cluster" />
      <KubernetesIndicator />
    </Fragment>
  );
}
