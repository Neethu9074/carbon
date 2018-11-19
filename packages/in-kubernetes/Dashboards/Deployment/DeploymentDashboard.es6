import React, { Fragment } from 'react';

import { deploymentId as matrixDeploymentId, clusterId as matrixClusterId } from 'in-kubernetes/navigation/matrix';
import KubernetesIndicator from 'in-kubernetes/Dashboards/commonComponents/KubernetesIndicator';
import getKubernetesDeployment from 'in-subscription/kubernetes/getKubernetesDeployment';
import TypesBadgeList from 'in-kubernetes/Dashboards/commonComponents/TypesBadgeList';
import Breadcrumbs from 'in-sdk/components/dashboard/breadcrumb/Breadcrumbs';
import BasicDashboardHeader from 'in-new-components/BasicDashboardHeader';
import TabView from 'in-new-components/LocationAwareTabView/TabView';
import { deploymentDashboard } from 'in-kubernetes/navigation/paths';
import tabs from 'in-kubernetes/Dashboards/Deployment/tabs/index';
import { DeploymentBreadcrumbs } from 'in-kubernetes/breadcrumbs';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { getTimeConfig } from 'in-stores/time/config';

export default function DeploymentDashboard({ location }) {
  const props = {
    deploymentId: getMatrixParameter(location, deploymentDashboard, matrixDeploymentId),
    clusterId: getMatrixParameter(location, deploymentDashboard, matrixClusterId),
    viewPath: deploymentDashboard,
    timeConfig: getTimeConfig(location)
  };

  return (
    <Fragment>
      <Breadcrumbs items={DeploymentBreadcrumbs(props)} />
      <TabView
        result$={getKubernetesDeployment({
          id: props.deploymentId,
          timeConfig: props.timeConfig
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
  return (
    <BasicDashboardHeader title="Deployment" icon="lib_kubernetes_workload" {...props} renderSubTypes={SubTypes} />
  );
}

function SubTypes() {
  return (
    <Fragment>
      <TypesBadgeList type="K8s Deployment" />
      <KubernetesIndicator />
    </Fragment>
  );
}
