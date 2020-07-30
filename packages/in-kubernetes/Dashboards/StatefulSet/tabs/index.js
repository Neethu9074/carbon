import React from 'react';

import getKubernetesWorkloadControllerItemCounters from 'in-subscription/kubernetes/getKubernetesWorkloadControllerItemCounters';
import { EventsWithoutNamespace } from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Events';
import TabLabelWithCounter from 'in-kubernetes/Dashboards/commonComponents/TabLabelWithCounter';
import Services from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Services';
import { statefulSetDashboardFullyQualified } from 'in-kubernetes/navigation/paths';
import Nodes from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Nodes';
import Pods from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Pods';
import Summary from 'in-kubernetes/Dashboards/StatefulSet/tabs/Summary';
import Details from 'in-kubernetes/Dashboards/StatefulSet/tabs/Details';

export default [
  {
    label: 'Summary',
    path: `${statefulSetDashboardFullyQualified}/summary`,
    component: Summary
  },
  {
    label: 'Details',
    path: `${statefulSetDashboardFullyQualified}/details`,
    component: Details
  },
  {
    label: 'Events',
    path: `${statefulSetDashboardFullyQualified}/events`,
    component: EventsWithoutNamespace
  },
  {
    label: 'Nodes',
    path: `${statefulSetDashboardFullyQualified}/nodes`,
    component: Nodes,
    header: props => getCounterComponent(props, 'nodes')
  },
  {
    label: 'K8s Services',
    path: `${statefulSetDashboardFullyQualified}/services`,
    component: Services,
    header: props => getCounterComponent(props, 'services')
  },
  {
    label: 'Pods',
    path: `${statefulSetDashboardFullyQualified}/pods`,
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
