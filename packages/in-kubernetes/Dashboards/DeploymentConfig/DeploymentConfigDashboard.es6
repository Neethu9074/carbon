import React, { Fragment } from 'react';
import { get } from 'lodash';

import ErroneousEntityVersionList from 'in-kubernetes/Dashboards/commonComponents/ErroneousEntityVersionList';
import HealthIndicatorButtonPresenter from 'in-new-components/health/HealthIndicatorButtonPresenter';
import getOpenShiftDeploymentConfig$ from 'in-subscription/kubernetes/getOpenShiftDeploymentConfig';
import { deploymentConfigId as matrixDeploymentConfigId } from 'in-kubernetes/navigation/matrix';
import KubernetesIndicator from 'in-kubernetes/Dashboards/commonComponents/KubernetesIndicator';
import KubernetesIdsForBreadcrumb from 'in-kubernetes/breadcrumbs/KubernetesIdsForBreadcrumb';
import TypesBadgeList from 'in-kubernetes/Dashboards/commonComponents/TypesBadgeList';
import BetaMarker, { KubernetesBetaMarker } from 'in-new-components/BetaMarker';
import Breadcrumbs from 'in-sdk/components/dashboard/breadcrumb/Breadcrumbs';
import EntityHealthIndicator from 'in-new-components/EntityHealthIndicator';
import { deploymentConfigDashboard } from 'in-kubernetes/navigation/paths';
import BasicDashboardHeader from 'in-new-components/BasicDashboardHeader';
import tabs from 'in-kubernetes/Dashboards/DeploymentConfig/tabs/index';
import { DeploymentConfigBreadcrumbs } from 'in-kubernetes/breadcrumbs';
import TabView from 'in-new-components/LocationAwareTabView/TabView';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { getTimeConfig } from 'in-stores/time/config';

export default function DeploymentConfigDashboard({ location }) {
  const props = {
    deploymentConfigId: getMatrixParameter(location, deploymentConfigDashboard, matrixDeploymentConfigId),
    viewPath: deploymentConfigDashboard,
    timeConfig: getTimeConfig(location)
  };

  return (
    <Fragment>
      <KubernetesIdsForBreadcrumb
        timeConfig={props.timeConfig}
        deploymentConfigId={props.deploymentConfigId}
        renderBreadcrumbs={(clusterId, namespaceId) => (
          <Breadcrumbs
            items={DeploymentConfigBreadcrumbs({
              ...props,
              clusterId,
              namespaceId
            })}
          />
        )}
      />

      <TabView
        result$={getOpenShiftDeploymentConfig$({
          id: props.deploymentConfigId,
          timeConfig: props.timeConfig
        })}
        HeaderComponent={Header}
        location={location}
        tabs={tabs}
        props={props}
        renderErrors={errors => (
          <ErroneousEntityVersionList
            snapshotId={props.deploymentConfigId}
            timeConfig={props.timeConfig}
            errors={errors}
          />
        )}
      />
      <BetaMarker title="Tech Preview">{KubernetesBetaMarker}</BetaMarker>
    </Fragment>
  );
}

function Header(props) {
  return (
    <BasicDashboardHeader
      title="Deployment Config"
      icon="lib_kubernetes_workload"
      {...props}
      renderActions={Actions}
      renderSubTypes={SubTypes}
      getLabel={result => get(result, ['data', 'name'])}
    />
  );
}

function Actions({ deploymentConfigId, timeConfig }) {
  return (
    <EntityHealthIndicator
      showOkayOnNoIssues={false}
      IndicatorPresenter={HealthIndicatorButtonPresenter}
      snapshotId={deploymentConfigId}
      timeConfig={timeConfig}
    />
  );
}

function SubTypes({ result }) {
  return (
    <Fragment>
      <TypesBadgeList type="K8s Deployment Config" />
      <KubernetesIndicator result={result} />
    </Fragment>
  );
}
