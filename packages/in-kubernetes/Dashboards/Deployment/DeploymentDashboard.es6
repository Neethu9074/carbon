import React, { Fragment } from 'react';
import { get } from 'lodash';

import KubernetesEntityHealthIndicatorBehavior from 'in-kubernetes/components/KubernetesEntityHealthIndicatorBehavior';
import HealthIndicatorButtonPresenter from 'in-new-components/health/HealthIndicatorButtonPresenter';
import KubernetesIndicator from 'in-kubernetes/Dashboards/commonComponents/KubernetesIndicator';
import getKubernetesDeployment from 'in-subscription/kubernetes/getKubernetesDeployment';
import ClusterAndNamespaceIds from 'in-kubernetes/breadcrumbs/ClusterAndNamespaceIds';
import TypesBadgeList from 'in-kubernetes/Dashboards/commonComponents/TypesBadgeList';
import { deploymentId as matrixDeploymentId } from 'in-kubernetes/navigation/matrix';
import BetaMarker, { KubernetesBetaMarker } from 'in-new-components/BetaMarker';
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
    viewPath: deploymentDashboard,
    timeConfig: getTimeConfig(location)
  };

  return (
    <Fragment>
      <ClusterAndNamespaceIds
        timeConfig={props.timeConfig}
        deploymentId={props.deploymentId}
        renderBreadcrumbs={(clusterId, namespaceId) => (
          <Breadcrumbs
            items={DeploymentBreadcrumbs({
              ...props,
              clusterId,
              namespaceId
            })}
          />
        )}
      />

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
      <BetaMarker title="Tech Preview">{KubernetesBetaMarker}</BetaMarker>
    </Fragment>
  );
}

function Header(props) {
  return (
    <BasicDashboardHeader
      title="Deployment"
      icon="lib_kubernetes_workload"
      {...props}
      renderActions={Actions}
      renderSubTypes={SubTypes}
      getLabel={result => get(result, ['data', 'name'])}
    />
  );
}

function Actions({ deploymentId, timeConfig }) {
  return (
    <Fragment>
      <KubernetesEntityHealthIndicatorBehavior
        showOkayOnNoIssues={false}
        IndicatorPresenter={HealthIndicatorButtonPresenter}
        deploymentId={deploymentId}
        timeConfig={timeConfig}
      />
    </Fragment>
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
