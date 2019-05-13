import React from 'react';

import getKubernetesNamespaceItemCounters from 'in-subscription/kubernetes/getKubernetesNamespaceItemCounters';
import { EventsWithoutNamespace } from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Events';
import TabLabelWithCounter from 'in-kubernetes/Dashboards/commonComponents/TabLabelWithCounter';
import Deployments from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Deployments';
import Services from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Services';
import { namespaceDashboardFullyQualified } from 'in-kubernetes/navigation/paths';
import Pods from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Pods';
import PodMapTab from 'in-kubernetes/Dashboards/Namespace/tabs/PodMapTab';
import Summary from 'in-kubernetes/Dashboards/Namespace/tabs/Summary';
import Details from 'in-kubernetes/Dashboards/Namespace/tabs/Details';

export default [
  {
    label: 'Summary',
    path: `${namespaceDashboardFullyQualified}/summary`,
    component: Summary
  },
  {
    label: 'Details',
    path: `${namespaceDashboardFullyQualified}/details`,
    component: Details
  },
  {
    label: 'Events',
    path: `${namespaceDashboardFullyQualified}/events`,
    component: EventsWithoutNamespace
  },
  {
    label: 'Deployments',
    path: `${namespaceDashboardFullyQualified}/deployments`,
    component: Deployments,
    header: props => getCounterComponent(props, 'deployments')
  },
  {
    label: 'K8s Services',
    path: `${namespaceDashboardFullyQualified}/services`,
    component: Services,
    header: props => getCounterComponent(props, 'services')
  },
  {
    label: 'Pod Map',
    path: `${namespaceDashboardFullyQualified}/podMap`,
    component: PodMapTab
  },
  {
    label: 'Pods',
    path: `${namespaceDashboardFullyQualified}/pods`,
    component: Pods,
    header: props => getCounterComponent(props, 'pods')
  }
].filter(Boolean);

function getCounterComponent(props, resultPropName) {
  return (
    <TabLabelWithCounter
      label={props.tab.label}
      getCounters={() =>
        getKubernetesNamespaceItemCounters({ namespaceId: props.namespaceId, timeConfig: props.timeConfig })
      }
      resultPropName={resultPropName}
    />
  );
}
