/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { get } from 'lodash';
import React from 'react';

import AnalyzeCallsButton, { getFilters } from 'in-kubernetes/Dashboards/commonComponents/AnalyzeCallsButton';
import DashboardButtonLine from 'in-kubernetes/Dashboards/commonComponents/DashboardButtonLine';
import KubernetesIndicator from 'in-kubernetes/Dashboards/commonComponents/KubernetesIndicator';
import KubernetesIdsForBreadcrumb from 'in-kubernetes/breadcrumbs/KubernetesIdsForBreadcrumb';
import LoggingIntegrationButtons from 'in-integrations/logging/LoggingIntegrationButtons';
import TypesBadgeList from 'in-kubernetes/Dashboards/commonComponents/TypesBadgeList';
import CenterAlignmentColumn from 'in-components/layout/CenterAlignmentColumn';
import getKubernetesPod from 'in-subscription/kubernetes/getKubernetesPod';
import { podId as matrixPodId } from 'in-kubernetes/navigation/matrix';
import TabView from 'in-components/LocationAwareTabView/TabView';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import EntityVersionList from 'in-components/EntityVersionList';
import Breadcrumbs from 'in-components/breadcrumb/Breadcrumbs';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import { podDashboard } from 'in-kubernetes/navigation/paths';
import DashboardHeader from 'in-components/DashboardHeader';
import tabs from 'in-kubernetes/Dashboards/Pod/tabs/index';
import { PodBreadcrumbs } from 'in-kubernetes/breadcrumbs';
import { getTimeConfig } from 'in-stores/time/config';
import { podTabChange } from 'in-kubernetes/tracker';
import { plugins } from 'in-forge/constants';
import Footer from 'in-components/Footer';
import { t } from 'in-i18n';

export default function PodDashboard({ location }) {
  const props = {
    podId: getMatrixParameter(location, podDashboard, matrixPodId),
    viewPath: podDashboard,
    timeConfig: getTimeConfig(location)
  };

  return (
    <>
      <ViewTrackingMeta
        data={{
          productArea: 'Kubernetes',
          pageRootName: t('in-kubernetes:kubernetesPageRootName', {
            objectType: t('in-kubernetes:dashboards.pod')
          })
        }}
      />

      <KubernetesIdsForBreadcrumb
        timeConfig={props.timeConfig}
        podId={props.podId}
        renderBreadcrumbs={(clusterId, namespaceId, workloadControllerId, workloadControllerType) => (
          <Breadcrumbs
            items={PodBreadcrumbs({
              ...props,
              clusterId,
              namespaceId,
              workloadControllerId,
              workloadControllerType
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
      title={t('in-kubernetes:dashboards.kubernetesPod')}
      icon="lib_kubernetes_pod"
      label={get(props.result, ['data', 'label'])}
      renderButtonLine={renderButtonLine}
      renderMetaInformation={renderMetaInformation}
    />
  );
}

function renderButtonLine({ podId, timeConfig, result }) {
  const clusterName = result.data?.clusterId;
  const namespaceName = result.data?.namespace;
  const podName = result.data?.label;
  return (
    <>
      <DashboardButtonLine
        snapshotId={podId}
        timeConfig={timeConfig}
        plugin={plugins.kubernetesPod}
        tagFilters={getFilters({ clusterName, namespaceName, podName })}
      />
      <AnalyzeCallsButton
        clusterName={clusterName}
        namespaceName={namespaceName}
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
      <TypesBadgeList type={t('in-kubernetes:dashboards.k8SPod')} />
      <KubernetesIndicator result={result} />
    </>
  );
}
