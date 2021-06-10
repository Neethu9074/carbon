/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { get } from 'lodash';
import React from 'react';

import AnalyzeCallsButton, { getFilters } from 'in-kubernetes/Dashboards/commonComponents/AnalyzeCallsButton';
import KubernetesIndicator from 'in-kubernetes/Dashboards/commonComponents/KubernetesIndicator';
import KubernetesIdsForBreadcrumb from 'in-kubernetes/breadcrumbs/KubernetesIdsForBreadcrumb';
import TypesBadgeList from 'in-kubernetes/Dashboards/commonComponents/TypesBadgeList';
import getKubernetesService from 'in-subscription/kubernetes/getKubernetesService';
import { serviceId as matrixServiceId } from 'in-kubernetes/navigation/matrix';
import CenterAlignmentColumn from 'in-components/layout/CenterAlignmentColumn';
import { DESTINATION } from 'in-components/QueryBuilder/tagFilter/entities';
import ViewTrackingMeta from 'in-services/tracking/ViewTrackingMeta';
import ContextGuide from 'in-components/ContextGuide/ContextGuide';
import { serviceDashboard } from 'in-kubernetes/navigation/paths';
import TabView from 'in-components/LocationAwareTabView/TabView';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { isOpenshift } from 'in-kubernetes/clusterDistributions';
import EntityVersionList from 'in-components/EntityVersionList';
import Breadcrumbs from 'in-components/breadcrumb/Breadcrumbs';
import tabs from 'in-kubernetes/Dashboards/Service/tabs/index';
import { ServiceBreadcrumbs } from 'in-kubernetes/breadcrumbs';
import DashboardHeader from 'in-components/DashboardHeader';
import { createGroupBy } from 'in-analyze/navigation/paths';
import { serviceTabChange } from 'in-kubernetes/tracker';
import { getTimeConfig } from 'in-stores/time/config';
import { plugins } from 'in-forge/constants';
import Footer from 'in-components/Footer';
import { t } from 'in-i18n';

export default function ServiceDashboard({ location }) {
  const props = {
    serviceId: getMatrixParameter(location, serviceDashboard, matrixServiceId),
    viewPath: serviceDashboard,
    timeConfig: getTimeConfig(location)
  };

  return (
    <>
      <ViewTrackingMeta
        data={{
          productArea: 'Kubernetes',
          pageRootName: t('in-kubernetes:kubernetesPageRootName', {
            objectType: t('in-kubernetes:dashboards.service')
          })
        }}
      />

      <KubernetesIdsForBreadcrumb
        timeConfig={props.timeConfig}
        serviceId={props.serviceId}
        renderBreadcrumbs={(clusterId, namespaceId) => (
          <Breadcrumbs
            items={ServiceBreadcrumbs({
              ...props,
              clusterId,
              namespaceId
            })}
          />
        )}
      />

      <TabView
        result$={getKubernetesService({
          id: props.serviceId,
          timeConfig: props.timeConfig
        })}
        HeaderComponent={Header}
        location={location}
        tabs={tabs}
        tabChangeTracker={serviceTabChange}
        filterTabByResult={result => {
          return tab => {
            if (isOpenshift(get(result, ['data', 'clusterDistribution'], 'kubernetes'))) return true;
            else return !tab.path.endsWith('/deploymentconfigs');
          };
        }}
        props={props}
        renderErrors={errors => (
          <CenterAlignmentColumn>
            <EntityVersionList
              plugin={plugins.kubernetesService}
              snapshotId={props.serviceId}
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
      title={t('in-kubernetes:dashboards.kubernetesService')}
      icon="lib_kubernetes_service"
      label={get(props.result, ['data', 'name'])}
      renderButtonLine={renderButtonLine}
      renderMetaInformation={renderMetaInformation}
    />
  );
}

function renderMetaInformation({ result }) {
  return (
    <>
      <TypesBadgeList type={t('in-kubernetes:dashboards.k8SService')} />
      <KubernetesIndicator result={result} />
    </>
  );
}

function renderButtonLine({ timeConfig, result, serviceId }) {
  const clusterName = result.data?.clusterName;
  const namespaceName = result.data?.namespace;
  const serviceName = result.data?.name;
  return (
    <>
      <ContextGuide
        id={serviceId}
        timeConfig={timeConfig}
        plugin={plugins.kubernetesService}
        tagFilters={getFilters({ clusterName, namespaceName, serviceName })}
        serviceId={serviceId}
      />
      <AnalyzeCallsButton
        clusterName={clusterName}
        namespaceName={namespaceName}
        serviceName={serviceName}
        groupBy={createGroupBy('kubernetes.pod.name', DESTINATION)}
        timeConfig={timeConfig}
      />
    </>
  );
}
