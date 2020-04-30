import { get } from 'lodash';
import React from 'react';

import AnalyzeCallsButton, { getFilters } from 'in-kubernetes/Dashboards/commonComponents/AnalyzeCallsButton';
import DashboardButtonLine from 'in-kubernetes/Dashboards/commonComponents/DashboardButtonLine';
import KubernetesIndicator from 'in-kubernetes/Dashboards/commonComponents/KubernetesIndicator';
import KubernetesIdsForBreadcrumb from 'in-kubernetes/breadcrumbs/KubernetesIdsForBreadcrumb';
import getKubernetesDeployment from 'in-subscription/kubernetes/getKubernetesDeployment';
import TypesBadgeList from 'in-kubernetes/Dashboards/commonComponents/TypesBadgeList';
import { deploymentId as matrixDeploymentId } from 'in-kubernetes/navigation/matrix';
import CenterAlignmentColumn from 'in-components/layout/CenterAlignmentColumn';
import TabView from 'in-new-components/LocationAwareTabView/TabView';
import { deploymentDashboard } from 'in-kubernetes/navigation/paths';
import EntityVersionList from 'in-new-components/EntityVersionList';
import { plugins, fullyQualifiedPlugins } from 'in-forge/constants';
import tabs from 'in-kubernetes/Dashboards/Deployment/tabs/index';
import { DeploymentBreadcrumbs } from 'in-kubernetes/breadcrumbs';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import DashboardHeader from 'in-new-components/DashboardHeader';
import Breadcrumbs from 'in-components/breadcrumb/Breadcrumbs';
import { deploymentTabChange } from 'in-kubernetes/tracker';
import { getTimeConfig } from 'in-stores/time/config';
import Footer from 'in-new-components/Footer';

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
  const clusterName = result.data?.clusterId;
  const namespaceName = result.data?.namespace;
  const deploymentName = result.data?.name;
  return (
    <>
      <DashboardButtonLine
        snapshotId={deploymentId}
        timeConfig={timeConfig}
        plugin={fullyQualifiedPlugins.kubernetesDeployment}
        tagFilters={getFilters(clusterName, namespaceName, deploymentName)}
      />
      <AnalyzeCallsButton
        clusterName={clusterName}
        namespaceName={namespaceName}
        deploymentName={deploymentName}
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
