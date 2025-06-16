/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { get } from 'lodash';
import React from 'react';

import { useObservable } from '@instana/hooks';

import { getKubernetesPrometheusMetricsWithDefaults } from 'in-kubernetes/subscriptions/getKubernetesPrometheusMetrics';
import { beeInstanaInfraMetricsEnabled, beeinstanaInfraMetricsWithTimeshiftEnabled } from 'in-services/featureFlags';
import KubernetesIndicator from 'in-kubernetes/Dashboards/commonComponents/KubernetesIndicator/KubernetesIndicator';
import AnalyzeCallsButton, { getFilters } from 'in-kubernetes/Dashboards/commonComponents/AnalyzeCallsButton';
import RenderButtonLineSecondary from 'in-kubernetes/Dashboards/commonComponents/RenderButtonLineSecondary';
import { cronJobId as matrixCronJobId, podId as matrixPodId } from 'in-kubernetes/navigation/matrix';
import DashboardButtonLine from 'in-kubernetes/Dashboards/commonComponents/DashboardButtonLine';
import KubernetesIdsForBreadcrumb from 'in-kubernetes/breadcrumbs/KubernetesIdsForBreadcrumb';
import LoggingIntegrationButtons from 'in-integrations/logging/LoggingIntegrationButtons';
import TypesBadgeList from 'in-kubernetes/Dashboards/commonComponents/TypesBadgeList';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import CenterAlignmentColumn from 'in-components/layout/CenterAlignmentColumn';
import getKubernetesPod from 'in-kubernetes/subscriptions/getKubernetesPod';
import TimeShiftDropdown from 'in-components/TimeShift/TimeShiftDropdown';
import { LOG_KUBERNETES_POD_NAME } from 'in-logging/queryBuilder';
import TabView from 'in-components/LocationAwareTabView/TabView';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { productAreas } from 'in-services/tracking/productAreas';
import EntityVersionList from 'in-components/EntityVersionList';
import Breadcrumbs from 'in-components/breadcrumb/Breadcrumbs';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import { podDashboard } from 'in-kubernetes/navigation/paths';
import { useKubernetesTracker } from 'in-kubernetes/tracker';
import DashboardHeader from 'in-components/DashboardHeader';
import { getTimeShiftLabel } from 'in-stores/time/shifting';
import tabs from 'in-kubernetes/Dashboards/Pod/tabs/index';
import { PodBreadcrumbs } from 'in-kubernetes/breadcrumbs';
import { pageNames } from 'in-services/tracking/pageNames';
import { pendingResult } from 'in-services/fixedObjects';
import { getTimeConfig } from 'in-stores/time/config';
import { plugins } from 'in-forge/constants';
import Footer from 'in-components/Footer';
import { t } from 'in-i18n';

export default function PodDashboard({ location }) {
  const props = {
    podId: getMatrixParameter(location, podDashboard, matrixPodId),
    cronJobId: getMatrixParameter(location, podDashboard, matrixCronJobId),
    viewPath: podDashboard,
    timeConfig: getTimeConfig(location)
  };

  const { k8sTabChange, kubernetesTimeShiftSelectTracker } = useKubernetesTracker();

  const { podId, timeConfig } = props;

  const prometheusEndpoints =
    useObservable(() => getKubernetesPrometheusMetricsWithDefaults({ podId, timeConfig }), [podId]) ?? pendingResult;
  const { loading } = prometheusEndpoints.progress;

  if (loading) {
    return <LoadingIndicator />;
  }

  const hasPrometheusEndpoints = prometheusEndpoints?.data?.items.length > 0;
  const allTabs = hasPrometheusEndpoints
    ? tabs
    : tabs.filter(tab => tab.label !== t('in-kubernetes:dashboards.prometheusMetrics'));

  return (
    <>
      <ViewTrackingMeta
        data={{
          productArea: productAreas.kubernetes,
          pageRootName: pageNames.pod_summary
        }}
      />
      <KubernetesIdsForBreadcrumb
        timeConfig={timeConfig}
        podId={podId}
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
          id: podId,
          timeConfig: timeConfig
        })}
        HeaderComponent={props => (
          <Header {...props} kubernetesTimeShiftSelectTracker={kubernetesTimeShiftSelectTracker} />
        )}
        location={location}
        tabs={allTabs}
        tabChangeTracker={e => {
          k8sTabChange({
            ...e,
            dashboard: 'pod',
            path: location.pathname
          });
        }}
        props={props}
        renderErrors={errors => (
          <CenterAlignmentColumn>
            <EntityVersionList
              plugin={plugins.kubernetesPod}
              snapshotId={podId}
              timeConfig={timeConfig}
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
      renderButtonLineSecondary={renderButtonLineSecondary}
      renderMetaInformation={renderMetaInformation}
    />
  );
}

function renderButtonLine({ podId, timeConfig, result }) {
  const { clusterId: clusterName, namespace: namespaceName, label: podName } = result?.data || {};

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
    </>
  );
}

function renderButtonLineSecondary(props) {
  const { timeConfig, podId, result, kubernetesTimeShiftSelectTracker } = props;
  const podName = result?.data?.label;

  return (
    <>
      <LoggingIntegrationButtons
        addMargin
        tagFilter={{ name: LOG_KUBERNETES_POD_NAME, value: podName }}
        kubernetesPodName={podName}
        timeConfig={timeConfig}
      />
      {beeInstanaInfraMetricsEnabled && beeinstanaInfraMetricsWithTimeshiftEnabled && (
        <TimeShiftDropdown
          onChange={offset =>
            kubernetesTimeShiftSelectTracker({
              area: 'pod',
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

function renderMetaInformation({ result }) {
  return (
    <>
      <TypesBadgeList type={t('in-kubernetes:dashboards.k8SPod')} />
      <KubernetesIndicator result={result} />
    </>
  );
}
