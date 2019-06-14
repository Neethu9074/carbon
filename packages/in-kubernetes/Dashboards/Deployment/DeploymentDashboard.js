import React, { Fragment } from 'react';
import { get } from 'lodash';

import HealthIndicatorButtonPresenter from 'in-new-components/health/HealthIndicatorButtonPresenter';
import KubernetesIndicator from 'in-kubernetes/Dashboards/commonComponents/KubernetesIndicator';
import KubernetesIdsForBreadcrumb from 'in-kubernetes/breadcrumbs/KubernetesIdsForBreadcrumb';
import AnalyzeCallsButton from 'in-kubernetes/Dashboards/commonComponents/AnalyzeCallsButton';
import getKubernetesDeployment from 'in-subscription/kubernetes/getKubernetesDeployment';
import TypesBadgeList from 'in-kubernetes/Dashboards/commonComponents/TypesBadgeList';
import { deploymentId as matrixDeploymentId } from 'in-kubernetes/navigation/matrix';
import Breadcrumbs from 'in-sdk/components/dashboard/breadcrumb/Breadcrumbs';
import EntityHealthIndicator from 'in-new-components/EntityHealthIndicator';
import BasicDashboardHeader from 'in-new-components/BasicDashboardHeader';
import TabView from 'in-new-components/LocationAwareTabView/TabView';
import { deploymentDashboard } from 'in-kubernetes/navigation/paths';
import EntityVersionList from 'in-new-components/EntityVersionList';
import tabs from 'in-kubernetes/Dashboards/Deployment/tabs/index';
import { DeploymentBreadcrumbs } from 'in-kubernetes/breadcrumbs';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { deploymentTabChange } from 'in-kubernetes/tracker';
import { getTimeConfig } from 'in-stores/time/config';
import { plugins } from 'in-forge/constants';

export default function DeploymentDashboard({ location }) {
  const props = {
    deploymentId: getMatrixParameter(location, deploymentDashboard, matrixDeploymentId),
    viewPath: deploymentDashboard,
    timeConfig: getTimeConfig(location)
  };

  return (
    <Fragment>
      <KubernetesIdsForBreadcrumb
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
        tabChangeTracker={deploymentTabChange}
        props={props}
        renderErrors={errors => (
          <EntityVersionList
            plugin={plugins.kubernetesDeployment}
            snapshotId={props.deploymentId}
            timeConfig={props.timeConfig}
            errors={errors}
          />
        )}
      />
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

function Actions({ deploymentId, timeConfig, result }) {
  return (
    <Fragment>
      <AnalyzeCallsButton
        clusterName={get(result, ['data', 'clusterId'])}
        namespaceName={get(result, ['data', 'namespace'])}
        deploymentName={get(result, ['data', 'name'])}
        groupByTag={{ name: 'kubernetes.pod.name' }}
        timeConfig={timeConfig}
      />
      <EntityHealthIndicator
        showOkayOnNoIssues={false}
        IndicatorPresenter={HealthIndicatorButtonPresenter}
        snapshotId={deploymentId}
        timeConfig={timeConfig}
      />
    </Fragment>
  );
}

function SubTypes({ result }) {
  return (
    <Fragment>
      <TypesBadgeList type="K8s Deployment" />
      <KubernetesIndicator result={result} />
    </Fragment>
  );
}
