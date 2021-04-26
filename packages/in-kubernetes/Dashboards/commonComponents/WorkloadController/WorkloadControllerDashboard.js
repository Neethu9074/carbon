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
import TypesBadgeList from 'in-kubernetes/Dashboards/commonComponents/TypesBadgeList';
import { DESTINATION } from 'in-new-components/QueryBuilder/tagFilter/entities';
import CenterAlignmentColumn from 'in-components/layout/CenterAlignmentColumn';
import TabView from 'in-new-components/LocationAwareTabView/TabView';
import ViewTrackingMeta from 'in-services/tracking/ViewTrackingMeta';
import EntityVersionList from 'in-new-components/EntityVersionList';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import DashboardHeader from 'in-new-components/DashboardHeader';
import Breadcrumbs from 'in-components/breadcrumb/Breadcrumbs';
import { createGroupBy } from 'in-analyze/navigation/paths';
import { getTimeConfig } from 'in-stores/time/config';
import Footer from 'in-new-components/Footer';
import { t } from 'in-i18n';

export default function WorkloadControllerDashboard({
  location,
  workloadControllerType,
  plugin,
  dashboardPath,
  matrixParameterId,
  BreadCrumbComponent,
  workloadControllerSubscriptionName,
  tabChangeTracker,
  headerTitle,
  badgeType,
  tabs
}) {
  const props = {
    workloadControllerType: workloadControllerType,
    workloadControllerId: getMatrixParameter(location, dashboardPath, matrixParameterId),
    workloadControllerSubscriptionName: workloadControllerSubscriptionName,
    viewPath: dashboardPath,
    timeConfig: getTimeConfig(location),
    headerTitle: headerTitle,
    badgeType: badgeType,
    plugin: plugin,
    BreadCrumbComponent: BreadCrumbComponent
  };
  props[`${props.workloadControllerType}Id`] = props.workloadControllerId;

  return (
    <>
      <ViewTrackingMeta
        data={{
          productArea: 'Kubernetes',
          pageRootName: t('in-kubernetes:kubernetesPageRootName', {
            objectType: props.headerTitle
          })
        }}
      />

      <KubernetesBreadcrumbs props={props} />
      <TabView
        result$={workloadControllerSubscriptionName({
          id: props.workloadControllerId,
          timeConfig: props.timeConfig
        })}
        HeaderComponent={Header}
        location={location}
        tabs={tabs}
        tabChangeTracker={tabChangeTracker}
        props={props}
        renderErrors={errors => (
          <CenterAlignmentColumn>
            <EntityVersionList
              plugin={plugin}
              snapshotId={props.workloadControllerId}
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

function KubernetesBreadcrumbs({ props }) {
  const breadcrumbProps = {
    timeConfig: props.timeConfig,
    renderBreadcrumbs: function showBreadcrumbs(clusterId, namespaceId) {
      return (
        <Breadcrumbs
          items={props.BreadCrumbComponent({
            ...props,
            clusterId,
            namespaceId
          })}
        />
      );
    }
  };
  breadcrumbProps[`${props.workloadControllerType}Id`] = props.workloadControllerId;
  return React.createElement(KubernetesIdsForBreadcrumb, breadcrumbProps, null);
}

function Header(props) {
  return (
    <DashboardHeader
      {...props}
      title={props.headerTitle}
      icon="lib_kubernetes_workload"
      label={get(props.result, ['data', 'name'])}
      renderButtonLine={renderButtonLine}
      renderMetaInformation={renderMetaInformation}
    />
  );
}

function renderButtonLine({ workloadControllerType, workloadControllerId, timeConfig, plugin, result }) {
  const clusterName = result.data?.clusterId;
  const namespaceName = result.data?.namespace;
  const workloadControllerName = result.data?.name;
  const analyzeCallsProps = {
    clusterName: clusterName,
    namespaceName: namespaceName,
    groupBy: createGroupBy('kubernetes.pod.name', DESTINATION),
    timeConfig: timeConfig
  };
  const workloadControllerFieldName = `${workloadControllerType}Name`;
  analyzeCallsProps[workloadControllerFieldName] = workloadControllerName;

  return (
    <>
      <DashboardButtonLine
        snapshotId={workloadControllerId}
        timeConfig={timeConfig}
        plugin={plugin}
        tagFilters={getFilters({ clusterName, namespaceName, [workloadControllerFieldName]: workloadControllerName })}
      />
      {React.createElement(AnalyzeCallsButton, analyzeCallsProps, null)}
    </>
  );
}

function renderMetaInformation({ badgeType, result }) {
  return (
    <>
      <TypesBadgeList type={badgeType} />
      <KubernetesIndicator result={result} />
    </>
  );
}
