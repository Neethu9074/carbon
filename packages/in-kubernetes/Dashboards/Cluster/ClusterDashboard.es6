import React, { Fragment } from 'react';

import KubernetesIndicator from 'in-kubernetes/Dashboards/commonComponents/KubernetesIndicator';
import TypesBadgeList from 'in-kubernetes/Dashboards/commonComponents/TypesBadgeList';
import getKubernetesCluster from 'in-subscription/kubernetes/getKubernetesCluster';
import { clusterId as matrixClusterId } from 'in-kubernetes/navigation/matrix';
import BasicDashboardHeader from 'in-new-components/BasicDashboardHeader';
import TabView from 'in-new-components/LocationAwareTabView/TabView';
import { clusterDashboard } from 'in-kubernetes/navigation/paths';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import tabs from 'in-kubernetes/Dashboards/Cluster/tabs/index';
import { getTimeConfig } from 'in-stores/time/config';

export default function ClusterDashboard({ location }) {
  const props = {
    clusterId: getMatrixParameter(location, clusterDashboard, matrixClusterId),
    viewPath: clusterDashboard,
    timeConfig: getTimeConfig(location)
  };

  return (
    <Fragment>
      <TabView
        result$={getKubernetesCluster({
          id: props.clusterId,
          timeConfig: props.timeConfig,
          metrics: {}
        })}
        HeaderComponent={Header}
        location={location}
        tabs={tabs}
        props={props}
      />
    </Fragment>
  );
}

function Header(props) {
  return <BasicDashboardHeader title="Cluster" icon="lib_kubernetes_cluster" {...props} renderSubTypes={SubTypes} />;
}

function SubTypes() {
  return (
    <Fragment>
      <TypesBadgeList type="K8s Cluster" />
      <KubernetesIndicator />
    </Fragment>
  );
}
