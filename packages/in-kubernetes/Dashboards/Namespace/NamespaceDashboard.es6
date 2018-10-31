import React, { Fragment } from 'react';

import KubernetesIndicator from 'in-kubernetes/Dashboards/commonComponents/KubernetesIndicator';
import TypesBadgeList from 'in-kubernetes/Dashboards/commonComponents/TypesBadgeList';
import { namespaceId as matricNamespaceId } from 'in-kubernetes/navigation/matrix';
import BasicDashboardHeader from 'in-new-components/BasicDashboardHeader';
import TabView from 'in-new-components/LocationAwareTabView/TabView';
import { namespaceDashboard } from 'in-kubernetes/navigation/paths';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import tabs from 'in-kubernetes/Dashboards/Namespace/tabs/index';
import { timeConfig$ } from 'in-stores/time/config';
import { always } from 'in-services/fixedStreams';
import connectTo from 'in-hoc/connectTo';

export default connectTo({ timeConfig: timeConfig$ }, function NamespaceDashboard({ location, timeConfig }) {
  const props = {
    namespaceId: getMatrixParameter(location, namespaceDashboard, matricNamespaceId),
    viewPath: namespaceDashboard,
    timeConfig
  };

  return (
    <Fragment>
      <TabView
        result$={always({
          progress: { loading: false },
          errors: [],
          data: {
            id: props.namespaceId,
            label: `Namespace ${props.namespaceId}`
          }
        })}
        HeaderComponent={Header}
        location={location}
        tabs={tabs}
        props={props}
      />
    </Fragment>
  );
});

function Header(props) {
  return (
    <BasicDashboardHeader title="Namespace" icon="lib_kubernetes_namespace" {...props} renderSubTypes={SubTypes} />
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
