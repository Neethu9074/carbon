import React, { Fragment } from 'react';
import { get } from 'lodash';

import { namespaceId as matrixNamespaceId, clusterId as matrixClusterId } from 'in-kubernetes/navigation/matrix';
import KubernetesIndicator from 'in-kubernetes/Dashboards/commonComponents/KubernetesIndicator';
import getKubernetesNamespace from 'in-subscription/kubernetes/getKubernetesNamespace';
import TypesBadgeList from 'in-kubernetes/Dashboards/commonComponents/TypesBadgeList';
import Breadcrumbs from 'in-sdk/components/dashboard/breadcrumb/Breadcrumbs';
import BasicDashboardHeader from 'in-new-components/BasicDashboardHeader';
import TabView from 'in-new-components/LocationAwareTabView/TabView';
import { namespaceDashboard } from 'in-kubernetes/navigation/paths';
import { NamespaceBreadcrumbs } from 'in-kubernetes/breadcrumbs';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import tabs from 'in-kubernetes/Dashboards/Namespace/tabs/index';
import { getTimeConfig } from 'in-stores/time/config';

export default function NamespaceDashboard({ location }) {
  const props = {
    namespaceId: getMatrixParameter(location, namespaceDashboard, matrixNamespaceId),
    clusterId: getMatrixParameter(location, namespaceDashboard, matrixClusterId),
    viewPath: namespaceDashboard,
    timeConfig: getTimeConfig(location)
  };

  return (
    <Fragment>
      <Breadcrumbs items={NamespaceBreadcrumbs(props)} />
      <TabView
        result$={getKubernetesNamespace({
          id: props.namespaceId,
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
  return (
    <BasicDashboardHeader
      title="Namespace"
      icon="lib_kubernetes_namespace"
      {...props}
      renderSubTypes={SubTypes}
      getLabel={result => get(result, ['data', 'namespace', 'label'])}
    />
  );
}

function SubTypes() {
  return (
    <Fragment>
      <TypesBadgeList type="K8s Namespace" />
      <KubernetesIndicator />
    </Fragment>
  );
}
