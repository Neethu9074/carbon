import React from 'react';

import ConditionsTabHeader from 'in-kubernetes/Dashboards/commonComponents/commonTabs/ConditionsTabHeader';
import getKubernetesNodeItemCounters from 'in-subscription/kubernetes/getKubernetesNodeItemCounters';
import TabLabelWithCounter from 'in-kubernetes/Dashboards/commonComponents/TabLabelWithCounter';
import Conditions from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Conditions';
import Infrastructure from 'in-kubernetes/Dashboards/Node/tabs/Infrastructure';
import { nodeDashboardFullyQualified } from 'in-kubernetes/navigation/paths';
import Pods from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Pods';
import getKubernetesNode from 'in-subscription/kubernetes/getKubernetesNode';
import Details from 'in-kubernetes/Dashboards/Node/tabs/Details/Details';
import Summary from 'in-kubernetes/Dashboards/Node/tabs/Summary';

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
    component: Conditions,
    header: ConditionsHeader
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

function ConditionsHeader({ nodeId, timeConfig }) {
  return (
    <ConditionsTabHeader
      getCounter={() =>
        getKubernetesNode({
          id: nodeId,
          timeConfig
        }).map(result => (result.data ? { data: result.data.conditions } : null))
      }
    />
  );
}
