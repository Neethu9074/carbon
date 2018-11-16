import React, { Fragment } from 'react';

import {
  clusterId as matrixClusterId,
  serviceId as matrixServiceId,
  namespaceId as matrixNamespaceId
} from 'in-kubernetes/navigation/matrix';
import KubernetesIndicator from 'in-kubernetes/Dashboards/commonComponents/KubernetesIndicator';
import TypesBadgeList from 'in-kubernetes/Dashboards/commonComponents/TypesBadgeList';
import getKubernetesService from 'in-subscription/kubernetes/getKubernetesService';
import Breadcrumbs from 'in-sdk/components/dashboard/breadcrumb/Breadcrumbs';
import BasicDashboardHeader from 'in-new-components/BasicDashboardHeader';
import TabView from 'in-new-components/LocationAwareTabView/TabView';
import { serviceDashboard } from 'in-kubernetes/navigation/paths';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import tabs from 'in-kubernetes/Dashboards/Service/tabs/index';
import { ServiceBreadcrumbs } from 'in-kubernetes/breadcrumbs';
import { getTimeConfig } from 'in-stores/time/config';

export default function ServiceDashboard({ location }) {
  const props = {
    serviceId: getMatrixParameter(location, serviceDashboard, matrixServiceId),
    namespaceId: getMatrixParameter(location, serviceDashboard, matrixNamespaceId),
    clusterId: getMatrixParameter(location, serviceDashboard, matrixClusterId),
    viewPath: serviceDashboard,
    timeConfig: getTimeConfig(location)
  };

  return (
    <Fragment>
      <Breadcrumbs items={ServiceBreadcrumbs(props)} />
      <TabView
        result$={getKubernetesService({
          id: props.serviceId,
          timeConfig: props.timeConfig
        })}
        HeaderComponent={Header}
        location={location}
        tabs={tabs}
        props={props}
      />
    </Fragment>
  );
}

function Header(props) {
  return <BasicDashboardHeader title="Service" icon="lib_kubernetes_service" {...props} renderSubTypes={SubTypes} />;
}

function SubTypes() {
  return (
    <Fragment>
      <TypesBadgeList type="K8s Service" />
      <KubernetesIndicator />
    </Fragment>
  );
}
