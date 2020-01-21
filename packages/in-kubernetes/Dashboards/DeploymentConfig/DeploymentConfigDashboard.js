import { get } from 'lodash';
import React from 'react';

import getOpenShiftDeploymentConfig$ from 'in-subscription/kubernetes/getOpenShiftDeploymentConfig';
import { deploymentConfigId as matrixDeploymentConfigId } from 'in-kubernetes/navigation/matrix';
import DashboardButtonLine from 'in-kubernetes/Dashboards/commonComponents/DashboardButtonLine';
import KubernetesIndicator from 'in-kubernetes/Dashboards/commonComponents/KubernetesIndicator';
import KubernetesIdsForBreadcrumb from 'in-kubernetes/breadcrumbs/KubernetesIdsForBreadcrumb';
import AnalyzeCallsButton from 'in-kubernetes/Dashboards/commonComponents/AnalyzeCallsButton';
import TypesBadgeList from 'in-kubernetes/Dashboards/commonComponents/TypesBadgeList';
import CenterAlignmentColumn from 'in-components/layout/CenterAlignmentColumn';
import { deploymentConfigDashboard } from 'in-kubernetes/navigation/paths';
import tabs from 'in-kubernetes/Dashboards/DeploymentConfig/tabs/index';
import { DeploymentConfigBreadcrumbs } from 'in-kubernetes/breadcrumbs';
import TabView from 'in-new-components/LocationAwareTabView/TabView';
import EntityVersionList from 'in-new-components/EntityVersionList';
import { deploymentConfigTabChange } from 'in-kubernetes/tracker';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import DashboardHeader from 'in-new-components/DashboardHeader';
import Breadcrumbs from 'in-components/breadcrumb/Breadcrumbs';
import { getTimeConfig } from 'in-stores/time/config';
import Footer from 'in-new-components/Footer';
import { plugins } from 'in-forge/constants';

export default function DeploymentConfigDashboard({ location }) {
  const props = {
    deploymentConfigId: getMatrixParameter(location, deploymentConfigDashboard, matrixDeploymentConfigId),
    viewPath: deploymentConfigDashboard,
    timeConfig: getTimeConfig(location)
  };

  return (
    <>
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
        tabChangeTracker={deploymentConfigTabChange}
        props={props}
        renderErrors={errors => (
          <CenterAlignmentColumn>
            <EntityVersionList
              plugin={plugins.openshiftDeploymentConfig}
              snapshotId={props.deploymentConfigId}
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
      title="Deployment Config"
      icon="lib_kubernetes_workload"
      label={get(props.result, ['data', 'name'])}
      renderButtonLine={renderButtonLine}
      renderMetaInformation={renderMetaInformation}
    />
  );
}

function renderButtonLine({ deploymentConfigId, timeConfig, result }) {
  return (
    <>
      <DashboardButtonLine snapshotId={deploymentConfigId} timeConfig={timeConfig} />
      <AnalyzeCallsButton
        clusterName={get(result, ['data', 'clusterId'])}
        namespaceName={get(result, ['data', 'namespace'])}
        deploymentConfigName={get(result, ['data', 'name'])}
        groupByTag={{ name: 'kubernetes.pod.name' }}
        timeConfig={timeConfig}
      />
    </>
  );
}

function renderMetaInformation({ result }) {
  return (
    <>
      <TypesBadgeList type="K8s Deployment Config" />
      <KubernetesIndicator result={result} />
    </>
  );
}
