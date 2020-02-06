import { get } from 'lodash';
import React from 'react';

import getApplicationServicesForKubernetesService from 'in-subscription/kubernetes/getApplicationServicesForKubernetesService';
import EntityToInstanaServiceButton from 'in-new-components/EntityToInstanaServiceButton/EntityToInstanaServiceButton';
import KubernetesIndicator from 'in-kubernetes/Dashboards/commonComponents/KubernetesIndicator';
import KubernetesIdsForBreadcrumb from 'in-kubernetes/breadcrumbs/KubernetesIdsForBreadcrumb';
import AnalyzeCallsButton from 'in-kubernetes/Dashboards/commonComponents/AnalyzeCallsButton';
import TypesBadgeList from 'in-kubernetes/Dashboards/commonComponents/TypesBadgeList';
import getKubernetesService from 'in-subscription/kubernetes/getKubernetesService';
import { serviceId as matrixServiceId } from 'in-kubernetes/navigation/matrix';
import CenterAlignmentColumn from 'in-components/layout/CenterAlignmentColumn';
import TabView from 'in-new-components/LocationAwareTabView/TabView';
import EntityVersionList from 'in-new-components/EntityVersionList';
import { serviceDashboard } from 'in-kubernetes/navigation/paths';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { isOpenshift } from 'in-kubernetes/clusterDistributions';
import DashboardHeader from 'in-new-components/DashboardHeader';
import Breadcrumbs from 'in-components/breadcrumb/Breadcrumbs';
import tabs from 'in-kubernetes/Dashboards/Service/tabs/index';
import { ServiceBreadcrumbs } from 'in-kubernetes/breadcrumbs';
import StackButton from 'in-new-components/Stack/StackButton';
import { serviceTabChange } from 'in-kubernetes/tracker';
import { getTimeConfig } from 'in-stores/time/config';
import Footer from 'in-new-components/Footer';
import { plugins } from 'in-forge/constants';

export default function ServiceDashboard({ location }) {
  const props = {
    serviceId: getMatrixParameter(location, serviceDashboard, matrixServiceId),
    viewPath: serviceDashboard,
    timeConfig: getTimeConfig(location)
  };

  return (
    <>
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
            else return tab.label !== 'Deployment Configs';
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
      title="Service"
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
      <TypesBadgeList type="K8s Service" />
      <KubernetesIndicator result={result} />
    </>
  );
}

function renderButtonLine(props) {
  const k8sServiceUid = get(props.result, ['data', 'uid']);
  return (
    <>
      <StackButton id={props.serviceId} timeConfig={props.timeConfig} />
      {k8sServiceUid && (
        <EntityToInstanaServiceButton
          {...props}
          getServices={() =>
            getApplicationServicesForKubernetesService({
              kubernetesServiceUid: k8sServiceUid,
              timeConfig: props.timeConfig,
              order: {
                by: 'callsAgg',
                direction: 'DESC'
              },
              metrics: {
                callsAgg: {
                  metric: 'calls',
                  aggregation: 'SUM'
                },
                latencyAgg: {
                  metric: 'latency',
                  aggregation: 'MEAN'
                },
                errorsAgg: {
                  metric: 'errors',
                  aggregation: 'MEAN'
                },
                maxSeverity: {
                  metric: 'maxSeverity',
                  aggregation: 'MAX'
                }
              }
            })
          }
        />
      )}
      <AnalyzeCallsButton
        clusterName={get(props.result, ['data', 'clusterName'])}
        namespaceName={get(props.result, ['data', 'namespace'])}
        serviceName={get(props.result, ['data', 'name'])}
        groupByTag={{ name: 'kubernetes.pod.name' }}
        timeConfig={props.timeConfig}
      />
    </>
  );
}
