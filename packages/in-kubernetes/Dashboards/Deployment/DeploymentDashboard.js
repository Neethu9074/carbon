import { get } from 'lodash';
import React from 'react';

import HealthIndicatorButtonPresenter from 'in-new-components/health/HealthIndicatorButtonPresenter';
import KubernetesIndicator from 'in-kubernetes/Dashboards/commonComponents/KubernetesIndicator';
import KubernetesIdsForBreadcrumb from 'in-kubernetes/breadcrumbs/KubernetesIdsForBreadcrumb';
import AnalyzeCallsButton from 'in-kubernetes/Dashboards/commonComponents/AnalyzeCallsButton';
import getKubernetesDeployment from 'in-subscription/kubernetes/getKubernetesDeployment';
import TypesBadgeList from 'in-kubernetes/Dashboards/commonComponents/TypesBadgeList';
import { deploymentId as matrixDeploymentId } from 'in-kubernetes/navigation/matrix';
import CenterAlignmentColumn from 'in-components/layout/CenterAlignmentColumn';
import EntityHealthIndicator from 'in-new-components/EntityHealthIndicator';
import TabView from 'in-new-components/LocationAwareTabView/TabView';
import { deploymentDashboard } from 'in-kubernetes/navigation/paths';
import EntityVersionList from 'in-new-components/EntityVersionList';
import tabs from 'in-kubernetes/Dashboards/Deployment/tabs/index';
import { DeploymentBreadcrumbs } from 'in-kubernetes/breadcrumbs';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import DashboardHeader from 'in-new-components/DashboardHeader';
import Breadcrumbs from 'in-components/breadcrumb/Breadcrumbs';
import { deploymentTabChange } from 'in-kubernetes/tracker';
import { getTimeConfig } from 'in-stores/time/config';
import Footer from 'in-new-components/Footer';
import { plugins } from 'in-forge/constants';

export default function DeploymentDashboard({ location }) {
  const props = {
    deploymentId: getMatrixParameter(location, deploymentDashboard, matrixDeploymentId),
    viewPath: deploymentDashboard,
    timeConfig: getTimeConfig(location)
  };

  return (
    <>
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
          <CenterAlignmentColumn>
            <EntityVersionList
              plugin={plugins.kubernetesDeployment}
              snapshotId={props.deploymentId}
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
  return (
    <DashboardHeader
      {...props}
      title="Deployment"
      icon="lib_kubernetes_workload"
      label={get(props.result, ['data', 'name'])}
      renderButtonLine={renderButtonLine}
      renderMetaInformation={renderMetaInformation}
    />
  );
}

function renderButtonLine({ deploymentId, timeConfig, result }) {
  return (
    <>
      <EntityHealthIndicator
        showOkayOnNoIssues={false}
        IndicatorPresenter={HealthIndicatorButtonPresenter}
        snapshotId={deploymentId}
        timeConfig={timeConfig}
      />
      <AnalyzeCallsButton
        clusterName={get(result, ['data', 'clusterId'])}
        namespaceName={get(result, ['data', 'namespace'])}
        deploymentName={get(result, ['data', 'name'])}
        groupByTag={{ name: 'kubernetes.pod.name' }}
        timeConfig={timeConfig}
      />
    </>
  );
}

function renderMetaInformation({ result }) {
  return (
    <>
      <TypesBadgeList type="K8s Deployment" />
      <KubernetesIndicator result={result} />
    </>
  );
}
