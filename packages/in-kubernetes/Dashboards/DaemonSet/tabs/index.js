import React from 'react';

import getKubernetesWorkloadControllerItemCounters from 'in-subscription/kubernetes/getKubernetesWorkloadControllerItemCounters';
import { EventsWithoutNamespace } from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Events';
import TabLabelWithCounter from 'in-kubernetes/Dashboards/commonComponents/TabLabelWithCounter';
import Services from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Services';
import { daemonSetDashboardFullyQualified } from 'in-kubernetes/navigation/paths';
import Pods from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Pods';
import Summary from 'in-kubernetes/Dashboards/DaemonSet/tabs/Summary';
import Details from 'in-kubernetes/Dashboards/DaemonSet/tabs/Details';

export default [
  {
    label: 'Summary',
    path: `${daemonSetDashboardFullyQualified}/summary`,
    component: Summary
  },
  {
    label: 'Details',
    path: `${daemonSetDashboardFullyQualified}/details`,
    component: Details
  },
  {
    label: 'Events',
    path: `${daemonSetDashboardFullyQualified}/events`,
    component: EventsWithoutNamespace
  },
  {
    label: 'K8s Services',
    path: `${daemonSetDashboardFullyQualified}/services`,
    component: Services,
    header: props => getCounterComponent(props, 'services')
  },
  {
    label: 'Pods',
    path: `${daemonSetDashboardFullyQualified}/pods`,
    component: Pods,
    header: props => getCounterComponent(props, 'pods')
  }
].filter(Boolean);

function getCounterComponent(props, resultPropName) {
  return (
    <TabLabelWithCounter
      label={props.tab.label}
      getCounters={() =>
        getKubernetesWorkloadControllerItemCounters({
          workloadControllerId: props.workloadControllerId,
          timeConfig: props.timeConfig
        })
      }
      resultPropName={resultPropName}
    />
  );
}
