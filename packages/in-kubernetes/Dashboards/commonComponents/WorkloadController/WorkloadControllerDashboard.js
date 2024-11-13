/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { get } from 'lodash';
import React from 'react';

import { beeInstanaInfraMetricsEnabled, beeinstanaInfraMetricsWithTimeshiftEnabled } from 'in-services/featureFlags';
import KubernetesIndicator from 'in-kubernetes/Dashboards/commonComponents/KubernetesIndicator/KubernetesIndicator';
import AnalyzeCallsButton, { getFilters } from 'in-kubernetes/Dashboards/commonComponents/AnalyzeCallsButton';
import RenderButtonLineSecondary from 'in-kubernetes/Dashboards/commonComponents/RenderButtonLineSecondary';
import DashboardButtonLine from 'in-kubernetes/Dashboards/commonComponents/DashboardButtonLine';
import KubernetesIdsForBreadcrumb from 'in-kubernetes/breadcrumbs/KubernetesIdsForBreadcrumb';
import TypesBadgeList from 'in-kubernetes/Dashboards/commonComponents/TypesBadgeList';
import CenterAlignmentColumn from 'in-components/layout/CenterAlignmentColumn';
import { DESTINATION } from 'in-components/QueryBuilder/tagFilter/entities';
import TimeShiftDropdown from 'in-components/TimeShift/TimeShiftDropdown';
import TabView from 'in-components/LocationAwareTabView/TabView';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { productAreas } from 'in-services/tracking/productAreas';
import EntityVersionList from 'in-components/EntityVersionList';
import Breadcrumbs from 'in-components/breadcrumb/Breadcrumbs';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import DashboardHeader from 'in-components/DashboardHeader';
import { createGroupBy } from 'in-analyze/navigation/paths';
import { getTimeShiftLabel } from 'in-stores/time/shifting';
import { pageNames } from 'in-services/tracking/pageNames';
import { useSegmentTracker } from 'in-kubernetes/tracker';
import { getTimeConfig } from 'in-stores/time/config';
import Footer from 'in-components/Footer';

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

  const { kubernetesTimeShiftSelectTracker } = useSegmentTracker();

  return (
    <>
      <ViewTrackingMeta
        data={{
          productArea: productAreas.kubernetes,
          pageRootName: pageNames.deployment_summary
        }}
      />
      <KubernetesBreadcrumbs props={props} />
      <TabView
        result$={workloadControllerSubscriptionName({
          id: props.workloadControllerId,
          timeConfig: props.timeConfig
        })}
        HeaderComponent={props => (
          <Header {...props} kubernetesTimeShiftSelectTracker={kubernetesTimeShiftSelectTracker} />
        )}
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
  const { plugin } = props;
  return (
    <DashboardHeader
      {...props}
      title={props.headerTitle}
      icon={plugin ? `lib_infra_${plugin}` : `lib_kubernetes_workload`}
      label={get(props.result, ['data', 'name'])}
      renderButtonLine={renderButtonLine}
      renderButtonLineSecondary={renderButtonLineSecondary}
      renderMetaInformation={renderMetaInformation}
    />
  );
}

function renderButtonLineSecondary({ timeConfig, podId, kubernetesTimeShiftSelectTracker, workloadControllerType }) {
  return (
    <>
      {beeInstanaInfraMetricsEnabled && beeinstanaInfraMetricsWithTimeshiftEnabled && (
        <TimeShiftDropdown
          onChange={offset =>
            kubernetesTimeShiftSelectTracker({
              area: workloadControllerType,
              offset: getTimeShiftLabel({ offset: offset }),
              windowSize: timeConfig.windowSize,
              autoRefresh: timeConfig.autoRefresh
            })
          }
        />
      )}
      <RenderButtonLineSecondary timeConfig={timeConfig} snapshotId={podId} />
    </>
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
