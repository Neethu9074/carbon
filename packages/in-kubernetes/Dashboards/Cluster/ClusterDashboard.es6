import React, { Fragment } from 'react';

import KubernetesIndicator from 'in-kubernetes/Dashboards/commonComponents/KubernetesIndicator';
import TypesBadgeList from 'in-kubernetes/Dashboards/commonComponents/TypesBadgeList';
import { clusterId as matrixClusterId } from 'in-kubernetes/navigation/matrix';
import BasicDashboardHeader from 'in-new-components/BasicDashboardHeader';
import TabView from 'in-new-components/LocationAwareTabView/TabView';
import { clusterDashboard } from 'in-kubernetes/navigation/paths';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import tabs from 'in-kubernetes/Dashboards/Cluster/tabs/index';
import { timeConfig$ } from 'in-stores/time/config';
import { always } from 'in-services/fixedStreams';
import connectTo from 'in-hoc/connectTo';

export default connectTo({ timeConfig: timeConfig$ }, function ClusterDashboard({ location, timeConfig }) {
  const props = {
    clusterId: getMatrixParameter(location, clusterDashboard, matrixClusterId),
    viewPath: clusterDashboard,
    timeConfig
  };

  return (
    <Fragment>
      <TabView
        result$={always({
          progress: { loading: false },
          errors: [],
          data: {
            id: props.clusterId,
            label: props.clusterId
          }
        })}
        HeaderComponent={Header}
        location={location}
        tabs={tabs}
        props={props}
      />
    </Fragment>
  );
});

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
