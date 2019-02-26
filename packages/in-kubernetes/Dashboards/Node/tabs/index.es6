import React from 'react';

import getKubernetesNodeItemCounters from 'in-subscription/kubernetes/getKubernetesNodeItemCounters';
import TabLabelWithCounter from 'in-kubernetes/Dashboards/commonComponents/TabLabelWithCounter';
import Conditions from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Conditions';
import Infrastructure from 'in-kubernetes/Dashboards/Node/tabs/Infrastructure';
import { nodeDashboardFullyQualified } from 'in-kubernetes/navigation/paths';
import Pods from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Pods';
import Summary from 'in-kubernetes/Dashboards/Node/tabs/Summary';
import Details from 'in-kubernetes/Dashboards/Node/tabs/Details';

export default [
  {
    label: 'Summary',
    path: `${nodeDashboardFullyQualified}/summary`,
    component: Summary
  },
  {
    label: 'Details',
    path: `${nodeDashboardFullyQualified}/details`,
    component: Details
  },
  {
    label: 'Conditions',
    path: `${nodeDashboardFullyQualified}/conditions`,
    component: Conditions
  },
  {
    label: 'Pods',
    path: `${nodeDashboardFullyQualified}/pods`,
    component: Pods,
    header: props => getCounterComponent(props, 'pods')
  },
  {
    label: 'Infrastructure',
    path: `${nodeDashboardFullyQualified}/infrastructure`,
    component: Infrastructure
  }
].filter(Boolean);

function getCounterComponent(props, resultPropName) {
  return (
    <TabLabelWithCounter
      label={props.tab.label}
      getCounters={() => getKubernetesNodeItemCounters({ nodeId: props.nodeId, timeConfig: props.timeConfig })}
      resultPropName={resultPropName}
    />
  );
}
