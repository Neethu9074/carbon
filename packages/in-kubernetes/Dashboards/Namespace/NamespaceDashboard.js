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
import getKubernetesNamespace from 'in-subscription/kubernetes/getKubernetesNamespace';
import TypesBadgeList from 'in-kubernetes/Dashboards/commonComponents/TypesBadgeList';
import { namespaceId as matrixNamespaceId } from 'in-kubernetes/navigation/matrix';
import CenterAlignmentColumn from 'in-components/layout/CenterAlignmentColumn';
import TabView from 'in-new-components/LocationAwareTabView/TabView';
import ViewTrackingMeta from 'in-services/tracking/ViewTrackingMeta';
import EntityVersionList from 'in-new-components/EntityVersionList';
import { namespaceDashboard } from 'in-kubernetes/navigation/paths';
import { NamespaceBreadcrumbs } from 'in-kubernetes/breadcrumbs';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import tabs from 'in-kubernetes/Dashboards/Namespace/tabs/index';
import { isOpenshift } from 'in-kubernetes/clusterDistributions';
import DashboardHeader from 'in-new-components/DashboardHeader';
import Breadcrumbs from 'in-components/breadcrumb/Breadcrumbs';
import { entityTypes } from 'in-analyze/applicationFilter';
import { namespaceTabChange } from 'in-kubernetes/tracker';
import { getTimeConfig } from 'in-stores/time/config';
import Footer from 'in-new-components/Footer';
import { plugins } from 'in-forge/constants';

export default function NamespaceDashboard({ location }) {
  const props = {
    namespaceId: getMatrixParameter(location, namespaceDashboard, matrixNamespaceId),
    viewPath: namespaceDashboard,
    timeConfig: getTimeConfig(location)
  };

  return (
    <>
      <ViewTrackingMeta
        data={{
          productArea: 'Kubernetes',
          pageRootName: 'Kubernetes Namespace'
        }}
      />

      <KubernetesIdsForBreadcrumb
        timeConfig={props.timeConfig}
        namespaceId={props.namespaceId}
        renderBreadcrumbs={clusterId => (
          <Breadcrumbs
            items={NamespaceBreadcrumbs({
              ...props,
              clusterId,
              namespaceId: props.namespaceId
            })}
          />
        )}
      />

      <TabView
        result$={getKubernetesNamespace({
          id: props.namespaceId,
          timeConfig: props.timeConfig
        })}
        HeaderComponent={Header}
        location={location}
        tabs={tabs}
        filterTabByResult={result => {
          return tab => {
            if (isOpenshift(get(result, ['data', 'clusterDistribution'], 'kubernetes'))) return true;
            else return tab.label !== 'Deployment Configs';
          };
        }}
        tabChangeTracker={namespaceTabChange}
        props={props}
        renderErrors={errors => (
          <CenterAlignmentColumn>
            <EntityVersionList
              plugin={plugins.kubernetesNamespace}
              snapshotId={props.namespaceId}
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
      title="Kubernetes Namespace"
      icon="lib_kubernetes_namespace"
      label={get(props.result, ['data', 'label'])}
      renderButtonLine={renderButtonLine}
      renderMetaInformation={renderMetaInformation}
    />
  );
}

function renderButtonLine({ namespaceId, timeConfig, result }) {
  const clusterName = result.data?.clusterName;
  const namespaceName = result.data?.label;
  return (
    <>
      <DashboardButtonLine
        snapshotId={namespaceId}
        timeConfig={timeConfig}
        plugin={plugins.kubernetesNamespace}
        tagFilters={getFilters({ clusterName, namespaceName })}
      />
      <AnalyzeCallsButton
        clusterName={get(result, ['data', 'clusterName'])}
        namespaceName={get(result, ['data', 'label'])}
        groupByTag={{ name: 'kubernetes.service.name', entity: entityTypes.DESTINATION }}
        timeConfig={timeConfig}
      />
    </>
  );
}

function renderMetaInformation({ result }) {
  return (
    <>
      <TypesBadgeList type="K8s Namespace" />
      <KubernetesIndicator result={result} />
    </>
  );
}
