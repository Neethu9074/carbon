import React from 'react';

import getKubernetesDeploymentItemCounters from 'in-subscription/kubernetes/getKubernetesDeploymentItemCounters';
import TabLabelWithCounter from 'in-kubernetes/Dashboards/commonComponents/TabLabelWithCounter';
import Conditions from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Conditions';
import { deploymentDashboardFullyQualified } from 'in-kubernetes/navigation/paths';
import Pods from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Pods';
import Summary from 'in-kubernetes/Dashboards/Deployment/tabs/Summary';
import Details from 'in-kubernetes/Dashboards/Deployment/tabs/Details';

export default [
  {
    label: 'Summary',
    path: `${deploymentDashboardFullyQualified}/summary`,
    component: Summary
  },
  {
    label: 'Details',
    path: `${deploymentDashboardFullyQualified}/details`,
    component: Details
  },
  {
    label: 'Conditions',
    path: `${deploymentDashboardFullyQualified}/conditions`,
    component: Conditions
  },
  {
    label: 'Pods',
    path: `${deploymentDashboardFullyQualified}/pods`,
    component: Pods,
    header: props => getCounterComponent(props, 'pods')
  }
].filter(Boolean);

function getCounterComponent(props, resultPropName) {
  return (
    <TabLabelWithCounter
      label={props.tab.label}
      getCounters={() =>
        getKubernetesDeploymentItemCounters({ deploymentId: props.deploymentId, timeConfig: props.timeConfig })
      }
      resultPropName={resultPropName}
    />
  );
}
