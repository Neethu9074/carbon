/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { get } from 'lodash';
import React from 'react';

import KubernetesIndicator from 'in-kubernetes/Dashboards/commonComponents/KubernetesIndicator/KubernetesIndicator';
import RenderButtonLineSecondary from 'in-kubernetes/Dashboards/commonComponents/RenderButtonLineSecondary';
import DashboardButtonLine from 'in-kubernetes/Dashboards/commonComponents/DashboardButtonLine';
import KubernetesIdsForBreadcrumb from 'in-kubernetes/breadcrumbs/KubernetesIdsForBreadcrumb';
import TypesBadgeList from 'in-kubernetes/Dashboards/commonComponents/TypesBadgeList';
import getKubernetesCronJob from 'in-kubernetes/subscriptions/getKubernetesCronJob';
import { cronJobId as matrixCronJobId } from 'in-kubernetes/navigation/matrix';
import CenterAlignmentColumn from 'in-components/layout/CenterAlignmentColumn';
import { cronJobDashboard } from 'in-kubernetes/navigation/paths';
import TabView from 'in-components/LocationAwareTabView/TabView';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { productAreas } from 'in-services/tracking/productAreas';
import EntityVersionList from 'in-components/EntityVersionList';
import Breadcrumbs from 'in-components/breadcrumb/Breadcrumbs';
import { CronJobBreadcrumbs } from 'in-kubernetes/breadcrumbs';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import { useKubernetesTracker } from 'in-kubernetes/tracker';
import DashboardHeader from 'in-components/DashboardHeader';
import { pageNames } from 'in-services/tracking/pageNames';
import BadgeList from 'in-components/BadgeList/BadgeList';
import tabs from 'in-kubernetes/Dashboards/CronJob/tabs';
import { getTimeConfig } from 'in-stores/time/config';
import { plugins } from 'in-forge/constants';
import Footer from 'in-components/Footer';
import { t } from 'in-i18n';

export default function CronJobDashboard({ location }) {
  const props = {
    cronJobId: getMatrixParameter(location, cronJobDashboard, matrixCronJobId),
    viewPath: cronJobDashboard,
    timeConfig: getTimeConfig(location)
  };

  const { k8sTabChange } = useKubernetesTracker();

  return (
    <>
      <ViewTrackingMeta
        data={{
          productArea: productAreas.kubernetes,
          pageRootName: pageNames.cron_job_summary
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
        tabChangeTracker={e => {
          k8sTabChange({
            ...e,
            dashboard: 'cronJob',
            path: location.pathname
          });
        }}
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
  const { timeConfig, cronJobId } = props;
  return (
    <DashboardHeader
      {...props}
      title={t('in-kubernetes:dashboards.kubernetesCronJob')}
      icon="lib_infra_kubernetesCronJob"
      label={get(props.result, ['data', 'name'])}
      renderButtonLine={renderButtonLine}
      renderButtonLineSecondary={() => <RenderButtonLineSecondary timeConfig={timeConfig} snapshotId={cronJobId} />}
      renderMetaInformation={RenderMetaInformation}
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

function RenderMetaInformation({ result }) {
  const version = get(result, ['data', 'version']);

  return (
    <>
      {version && <BadgeList type={version} getColor={() => 'blue'} />}
      <TypesBadgeList type={t('in-kubernetes:dashboards.k8SCronJob')} />
      <KubernetesIndicator result={result} />
    </>
  );
}
