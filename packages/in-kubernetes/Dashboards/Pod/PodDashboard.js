import { get } from 'lodash';
import React from 'react';

import DashboardButtonLine from 'in-kubernetes/Dashboards/commonComponents/DashboardButtonLine';
import KubernetesIndicator from 'in-kubernetes/Dashboards/commonComponents/KubernetesIndicator';
import KubernetesIdsForBreadcrumb from 'in-kubernetes/breadcrumbs/KubernetesIdsForBreadcrumb';
import AnalyzeCallsButton from 'in-kubernetes/Dashboards/commonComponents/AnalyzeCallsButton';
import LoggingIntegrationButtons from 'in-integrations/logging/LoggingIntegrationButtons';
import TypesBadgeList from 'in-kubernetes/Dashboards/commonComponents/TypesBadgeList';
import CenterAlignmentColumn from 'in-components/layout/CenterAlignmentColumn';
import getKubernetesPod from 'in-subscription/kubernetes/getKubernetesPod';
import { podId as matrixPodId } from 'in-kubernetes/navigation/matrix';
import TabView from 'in-new-components/LocationAwareTabView/TabView';
import EntityVersionList from 'in-new-components/EntityVersionList';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import DashboardHeader from 'in-new-components/DashboardHeader';
import Breadcrumbs from 'in-components/breadcrumb/Breadcrumbs';
import { podDashboard } from 'in-kubernetes/navigation/paths';
import tabs from 'in-kubernetes/Dashboards/Pod/tabs/index';
import { PodBreadcrumbs } from 'in-kubernetes/breadcrumbs';
import { getTimeConfig } from 'in-stores/time/config';
import { podTabChange } from 'in-kubernetes/tracker';
import Footer from 'in-new-components/Footer';
import { plugins } from 'in-forge/constants';

export default function PodDashboard({ location }) {
  const props = {
    podId: getMatrixParameter(location, podDashboard, matrixPodId),
    viewPath: podDashboard,
    timeConfig: getTimeConfig(location)
  };

  return (
    <>
      <KubernetesIdsForBreadcrumb
        timeConfig={props.timeConfig}
        podId={props.podId}
        renderBreadcrumbs={(clusterId, namespaceId, deploymentId) => (
          <Breadcrumbs
            items={PodBreadcrumbs({
              ...props,
              clusterId,
              namespaceId,
              deploymentId
            })}
          />
        )}
      />

      <TabView
        result$={getKubernetesPod({
          id: props.podId,
          timeConfig: props.timeConfig
        })}
        HeaderComponent={Header}
        location={location}
        tabs={tabs}
        tabChangeTracker={podTabChange}
        props={props}
        renderErrors={errors => (
          <CenterAlignmentColumn>
            <EntityVersionList
              plugin={plugins.kubernetesPod}
              snapshotId={props.podId}
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
      title="Pod"
      icon="lib_kubernetes_pod"
      label={get(props.result, ['data', 'label'])}
      renderButtonLine={renderButtonLine}
      renderMetaInformation={renderMetaInformation}
    />
  );
}

function renderButtonLine({ podId, timeConfig, result }) {
  const podName = get(result, ['data', 'label']);
  return (
    <>
      <DashboardButtonLine snapshotId={podId} timeConfig={timeConfig} />
      <AnalyzeCallsButton
        clusterName={get(result, ['data', 'clusterId'])}
        namespaceName={get(result, ['data', 'namespace'])}
        podName={podName}
        timeConfig={timeConfig}
      />
      <LoggingIntegrationButtons kubernetesPodName={podName} timeConfig={timeConfig} />
    </>
  );
}

function renderMetaInformation({ result }) {
  return (
    <>
      <TypesBadgeList type="K8s Pod" />
      <KubernetesIndicator result={result} />
    </>
  );
}
