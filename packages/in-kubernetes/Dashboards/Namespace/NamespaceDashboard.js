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
import { DESTINATION } from 'in-components/QueryBuilder/tagFilter/entities';
import { namespaceDashboard } from 'in-kubernetes/navigation/paths';
import TabView from 'in-components/LocationAwareTabView/TabView';
import { NamespaceBreadcrumbs } from 'in-kubernetes/breadcrumbs';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import tabs from 'in-kubernetes/Dashboards/Namespace/tabs/index';
import { isOpenshift } from 'in-kubernetes/clusterDistributions';
import EntityVersionList from 'in-components/EntityVersionList';
import Breadcrumbs from 'in-components/breadcrumb/Breadcrumbs';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import DashboardHeader from 'in-components/DashboardHeader';
import { createGroupBy } from 'in-analyze/navigation/paths';
import { namespaceTabChange } from 'in-kubernetes/tracker';
import { getTimeConfig } from 'in-stores/time/config';
import { plugins } from 'in-forge/constants';
import Footer from 'in-components/Footer';
import { t } from 'in-i18n';

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
          pageRootName: t('in-kubernetes:kubernetesPageRootName', {
            objectType: t('in-kubernetes:dashboards.namespace')
          })
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
            else return !tab.path.endsWith('/deploymentconfigs');
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
      title={t('in-kubernetes:dashboards.kubernetesNamespace')}
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
        groupBy={createGroupBy('kubernetes.service.name', DESTINATION)}
        timeConfig={timeConfig}
      />
    </>
  );
}

function renderMetaInformation({ result }) {
  return (
    <>
      <TypesBadgeList type={t('in-kubernetes:dashboards.k8SNamespace')} />
      <KubernetesIndicator result={result} />
    </>
  );
}
