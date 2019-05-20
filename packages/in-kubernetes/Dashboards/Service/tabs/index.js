import React from 'react';

import getKubernetesServiceItemCounters from 'in-subscription/kubernetes/getKubernetesServiceItemCounters';
import { EventsWithoutNamespace } from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Events';
import TabLabelWithCounter from 'in-kubernetes/Dashboards/commonComponents/TabLabelWithCounter';
import Deployments from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Deployments';
import { serviceDashboardFullyQualified } from 'in-kubernetes/navigation/paths';
import Pods from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Pods';
import Summary from 'in-kubernetes/Dashboards/Service/tabs/Summary/Summary';
import Details from 'in-kubernetes/Dashboards/Service/tabs/Details';

export default [
  {
    label: 'Summary',
    path: `${serviceDashboardFullyQualified}/summary`,
    component: Summary
  },
  {
    label: 'Details',
    path: `${serviceDashboardFullyQualified}/details`,
    component: Details
  },
  {
    label: 'Events',
    path: `${serviceDashboardFullyQualified}/events`,
    component: EventsWithoutNamespace
  },
  {
    label: 'Deployments',
    path: `${serviceDashboardFullyQualified}/deployments`,
    component: Deployments,
    header: props => getCounterComponent(props, 'deployments')
  },
  {
    label: 'Pods',
    path: `${serviceDashboardFullyQualified}/pods`,
    component: Pods,
    header: props => getCounterComponent(props, 'pods')
  }
].filter(Boolean);

function getCounterComponent(props, resultPropName) {
  return (
    <TabLabelWithCounter
      label={props.tab.label}
      getCounters={() => getKubernetesServiceItemCounters({ serviceId: props.serviceId, timeConfig: props.timeConfig })}
      resultPropName={resultPropName}
    />
  );
}
