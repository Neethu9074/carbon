/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { get } from 'lodash';
import React from 'react';

import DashboardButtonLine from 'in-kubernetes/Dashboards/commonComponents/DashboardButtonLine';
import KubernetesIndicator from 'in-kubernetes/Dashboards/commonComponents/KubernetesIndicator';
import KubernetesIdsForBreadcrumb from 'in-kubernetes/breadcrumbs/KubernetesIdsForBreadcrumb';
import TypesBadgeList from 'in-kubernetes/Dashboards/commonComponents/TypesBadgeList';
import getKubernetesCronJob from 'in-subscription/kubernetes/getKubernetesCronJob';
import { cronJobId as matrixCronJobId } from 'in-kubernetes/navigation/matrix';
import CenterAlignmentColumn from 'in-components/layout/CenterAlignmentColumn';
import ViewTrackingMeta from 'in-services/tracking/ViewTrackingMeta';
import { cronJobDashboard } from 'in-kubernetes/navigation/paths';
import TabView from 'in-components/LocationAwareTabView/TabView';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import EntityVersionList from 'in-components/EntityVersionList';
import Breadcrumbs from 'in-components/breadcrumb/Breadcrumbs';
import { CronJobBreadcrumbs } from 'in-kubernetes/breadcrumbs';
import DashboardHeader from 'in-components/DashboardHeader';
import BadgeList from 'in-components/BadgeList/BadgeList';
import { cronJobTabChange } from 'in-kubernetes/tracker';
import tabs from 'in-kubernetes/Dashboards/CronJob/tabs';
import { getTimeConfig } from 'in-stores/time/config';
import { plugins } from 'in-forge/constants';
import Footer from 'in-components/Footer';
import theme from 'in-themes';
import { t } from 'in-i18n';

export default function CronJobDashboard({ location }) {
  const props = {
    cronJobId: getMatrixParameter(location, cronJobDashboard, matrixCronJobId),
    viewPath: cronJobDashboard,
    timeConfig: getTimeConfig(location)
  };

  return (
    <>
      <ViewTrackingMeta
        data={{
          productArea: 'Kubernetes',
          pageRootName: t('in-kubernetes:kubernetesPageRootName', {
            objectType: t('in-kubernetes:dashboards.cronJob')
          })
        }}
      />

      <KubernetesIdsForBreadcrumb
        timeConfig={props.timeConfig}
        cronJobId={props.cronJobId}
        renderBreadcrumbs={(clusterId, namespaceId) => {
          return (
            <Breadcrumbs
              items={CronJobBreadcrumbs({
                ...props,
                clusterId,
                namespaceId
              })}
            />
          );
        }}
      />

      <TabView
        result$={getKubernetesCronJob({
          id: props.cronJobId,
          timeConfig: props.timeConfig
        })}
        HeaderComponent={Header}
        location={location}
        tabs={tabs}
        tabChangeTracker={cronJobTabChange}
        props={props}
        renderErrors={errors => (
          <CenterAlignmentColumn>
            <EntityVersionList
              plugin={plugins.kubernetesCronJob}
              snapshotId={props.id}
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
      title={t('in-kubernetes:dashboards.kubernetesCronJob')}
      icon="lib_kubernetes_workload"
      label={get(props.result, ['data', 'name'])}
      renderButtonLine={renderButtonLine}
      renderMetaInformation={renderMetaInformation}
    />
  );
}

function renderButtonLine({ cronJobId, timeConfig, result }) {
  return (
    <DashboardButtonLine
      snapshotId={cronJobId}
      timeConfig={timeConfig}
      plugin={plugins.kubernetesNode}
      tagFilters={[{ name: 'kubernetes.cronjob.uid', value: result.data?.id, operator: 'EQUALS' }]}
    />
  );
}

function renderMetaInformation({ result }) {
  const version = get(result, ['data', 'version']);

  return (
    <>
      {version && <BadgeList type={version} getColor={() => theme.lib.colors.N700Medium} />}
      <TypesBadgeList type={t('in-kubernetes:dashboards.k8SCronJob')} />
      <KubernetesIndicator result={result} />
    </>
  );
}
