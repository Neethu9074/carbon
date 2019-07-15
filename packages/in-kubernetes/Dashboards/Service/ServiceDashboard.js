import React, { Fragment } from 'react';
import { get } from 'lodash';

import KubernetesServiceToInstanaServicesButton from 'in-kubernetes/components/KubernetesServiceToInstanaServicesButton';
import KubernetesServiceToInstanaServiceButton from 'in-kubernetes/components/KubernetesServiceToInstanaServiceButton';
import KubernetesIndicator from 'in-kubernetes/Dashboards/commonComponents/KubernetesIndicator';
import KubernetesIdsForBreadcrumb from 'in-kubernetes/breadcrumbs/KubernetesIdsForBreadcrumb';
import AnalyzeCallsButton from 'in-kubernetes/Dashboards/commonComponents/AnalyzeCallsButton';
import TypesBadgeList from 'in-kubernetes/Dashboards/commonComponents/TypesBadgeList';
import getKubernetesService from 'in-subscription/kubernetes/getKubernetesService';
import { nToMK8sServiceToInstanaServiceEnabled } from 'in-services/featureFlags';
import { serviceId as matrixServiceId } from 'in-kubernetes/navigation/matrix';
import CenterAlignmentColumn from 'in-components/layout/CenterAlignmentColumn';
import Breadcrumbs from 'in-sdk/components/dashboard/breadcrumb/Breadcrumbs';
import BasicDashboardHeader from 'in-new-components/BasicDashboardHeader';
import TabView from 'in-new-components/LocationAwareTabView/TabView';
import EntityVersionList from 'in-new-components/EntityVersionList';
import { serviceDashboard } from 'in-kubernetes/navigation/paths';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import tabs from 'in-kubernetes/Dashboards/Service/tabs/index';
import { ServiceBreadcrumbs } from 'in-kubernetes/breadcrumbs';
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
    <Fragment>
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
            if (get(result, ['data', 'distributionType'], 'Kubernetes') === 'OpenShift') return true;
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
    </Fragment>
  );
}

function Header(props) {
  return (
    <BasicDashboardHeader
      title="Service"
      icon="lib_kubernetes_service"
      {...props}
      renderSubTypes={SubTypes}
      renderActions={Actions}
    />
  );
}

function SubTypes({ result }) {
  return (
    <Fragment>
      <TypesBadgeList type="K8s Service" />
      <KubernetesIndicator result={result} />
    </Fragment>
  );
}

function Actions(props) {
  return (
    <Fragment>
      <AnalyzeCallsButton
        clusterName={get(props.result, ['data', 'clusterName'])}
        namespaceName={get(props.result, ['data', 'namespace'])}
        serviceName={get(props.result, ['data', 'name'])}
        groupByTag={{ name: 'kubernetes.pod.name' }}
        timeConfig={props.timeConfig}
      />
      {nToMK8sServiceToInstanaServiceEnabled ? (
        <KubernetesServiceToInstanaServicesButton {...props} />
      ) : (
        <KubernetesServiceToInstanaServiceButton {...props} />
      )}
    </Fragment>
  );
}
