/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { get } from 'lodash';
import React from 'react';

import type { Error as InstanaError } from '@instana/types';
import { useObservable } from '@instana/hooks';

// @ts-expect-error TS migration
import KubernetesIdsForBreadcrumb from 'in-kubernetes/breadcrumbs/KubernetesIdsForBreadcrumb';
// @ts-expect-error TS migration
import LoggingIntegrationButtons from 'in-integrations/logging/LoggingIntegrationButtons';
import { getKubernetesPrometheusMetricsWithDefaults } from 'in-kubernetes/subscriptions/getKubernetesPrometheusMetrics';
// @ts-expect-error TS migration
import TypesBadgeList from 'in-kubernetes/Dashboards/commonComponents/TypesBadgeList';
import { beeInstanaInfraMetricsEnabled, beeinstanaInfraMetricsWithTimeshiftEnabled } from 'in-services/featureFlags';
import KubernetesIndicator from 'in-kubernetes/Dashboards/commonComponents/KubernetesIndicator/KubernetesIndicator';
import RenderButtonLineSecondary from 'in-kubernetes/Dashboards/commonComponents/RenderButtonLineSecondary';
import { cronJobId as matrixCronJobId, podId as matrixPodId } from 'in-kubernetes/navigation/matrix';
// @ts-expect-error TS migration
import EntityVersionList from 'in-components/EntityVersionList';
import DashboardButtonLine from 'in-kubernetes/Dashboards/commonComponents/DashboardButtonLine';
// @ts-expect-error TS migration
import Breadcrumbs from 'in-components/breadcrumb/Breadcrumbs';
import AnalyzeCallsButton from 'in-kubernetes/Dashboards/commonComponents/AnalyzeCallsButton';
import tabs from 'in-kubernetes/Dashboards/Pod/tabs/otelIndex';
// @ts-expect-error TS migration
import { PodBreadcrumbs } from 'in-kubernetes/breadcrumbs';
import getOtelKubernetesPod from 'in-kubernetes/subscriptions/getOtelKubernetesPod';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import { podDashboard, podOtelDashboard } from 'in-kubernetes/navigation/paths';
import CenterAlignmentColumn from 'in-components/layout/CenterAlignmentColumn';
import { DESTINATION } from 'in-components/QueryBuilder/tagFilter/entities';
import TimeShiftDropdown from 'in-components/TimeShift/TimeShiftDropdown';
import { DashboardHeaderProps } from 'in-components/DashboardHeader';
import { LOG_KUBERNETES_POD_NAME } from 'in-logging/queryBuilder';
import TabView from 'in-components/LocationAwareTabView/TabView';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { productAreas } from 'in-services/tracking/productAreas';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import { useKubernetesTracker } from 'in-kubernetes/tracker';
import { TimeConfig, Result, KubernetesPod } from 'in-types';
import DashboardHeader from 'in-components/DashboardHeader';
import { getTimeShiftLabel } from 'in-stores/time/shifting';
import { createGroupBy } from 'in-analyze/navigation/paths';
import { pageNames } from 'in-services/tracking/pageNames';
import { pendingResult } from 'in-services/fixedObjects';
import { getTimeConfig } from 'in-stores/time/config';
import { Location } from 'in-stores/navigation/types';
import { plugins } from 'in-forge/constants';
import Footer from 'in-components/Footer';
import { t } from 'in-i18n';

export default function OtelPodDashboard({ location }: { location: Location }) {
  const props = {
    podId: getMatrixParameter(location, podDashboard, matrixPodId),
    cronJobId: getMatrixParameter(location, podDashboard, matrixCronJobId),
    viewPath: podOtelDashboard,
    timeConfig: getTimeConfig(location)
  };

  const { k8sTabChange, kubernetesTimeShiftSelectTracker } = useKubernetesTracker();

  const { podId, timeConfig } = props;

  const prometheusEndpoints =
    useObservable(() => getKubernetesPrometheusMetricsWithDefaults({ podId: podId ?? '', timeConfig }), [podId]) ?? pendingResult;
  const { loading } = prometheusEndpoints.progress;

  if (loading) {
    return <LoadingIndicator />;
  }

  interface DashboardTab {
    label: string;
    path: string;
    component: (props: any) => JSX.Element;
    header?: (props: any) => JSX.Element;
    [key: string]: unknown;
  }

  const hasPrometheusEndpoints = prometheusEndpoints?.data?.items.length > 0;
  const allTabs = hasPrometheusEndpoints
    ? tabs
    : tabs.filter((tab: DashboardTab) => tab.label !== t('in-kubernetes:dashboards.prometheusMetrics'));

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
        renderBreadcrumbs={(clusterId: string, namespaceId: string, workloadControllerId: string, workloadControllerType: string) => (
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
        result$={getOtelKubernetesPod({
          id: props.podId ?? '',
          timeConfig: props.timeConfig
        })}
        HeaderComponent={props => (
          <Header {...props} kubernetesTimeShiftSelectTracker={kubernetesTimeShiftSelectTracker} result={props.result ?? pendingResult} />
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

interface HeaderProps extends Omit<DashboardHeaderProps, 'title' | 'icon' | 'label' | 'renderButtonLine' | 'renderButtonLineSecondary' | 'renderMetaInformation'> {
  result: Result<KubernetesPod>;
  kubernetesTimeShiftSelectTracker: (params: any) => void;
}

interface RenderButtonLineProps {
  podId: string;
  timeConfig: TimeConfig;
  result: Result<KubernetesPod>;
}

interface RenderButtonLineSecondaryProps {
  timeConfig: TimeConfig;
  podId: string;
  result: Result<KubernetesPod>;
  kubernetesTimeShiftSelectTracker: (params: any) => void;
}

interface RenderMetaInformationProps {
  result: Result< KubernetesPod>;
}

function Header(props: HeaderProps) {
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

function renderButtonLine({ podId, timeConfig, result }: RenderButtonLineProps) {
  const { clusterId: clusterName, namespace: namespaceName, label: podName } = result?.data || {};

  return (
    <>
      <DashboardButtonLine
        snapshotId={podId}
        timeConfig={timeConfig}
        plugin={plugins.kubernetesPod}
        tagFilters={[]}
        pod={result.data}
      />

      <AnalyzeCallsButton
        clusterName={clusterName ?? ''}
        namespaceName={namespaceName}
        podName={podName}
        groupBy={createGroupBy('kubernetes.namespace.name', DESTINATION)}
      />
    </>
  );
}

function renderButtonLineSecondary(props: RenderButtonLineSecondaryProps) {
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
          disabled={false}
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

function renderMetaInformation({ result }: RenderMetaInformationProps) {
  return (
    <>
      <TypesBadgeList type={t('in-kubernetes:dashboards.k8SPod')} />
      {result?.data && (
        <KubernetesIndicator
          result={{
            data: result.data,
            time: result.time!,
            adjustedWindowSize: result.adjustedWindowSize!,
            resultPrecisionDetails: result.resultPrecisionDetails!,
            errors: (result.errors as InstanaError[]).map(e => ({
              code: e.code || 'InstanaError',
              message: e.message
            })),
            progress: result.progress!,
            backendTraceId: result.backendTraceId!
          }}
        />
      )}
    </>
  );
}
