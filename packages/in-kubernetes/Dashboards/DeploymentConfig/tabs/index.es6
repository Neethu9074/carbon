import React from 'react';

import getOpenShiftDeploymentConfigItemCounters$ from 'in-subscription/kubernetes/getOpenShiftDeploymentConfigItemCounters';
import TabLabelWithCounter from 'in-kubernetes/Dashboards/commonComponents/TabLabelWithCounter';
import Conditions from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Conditions';
import { deploymentConfigDashboardFullyQualified } from 'in-kubernetes/navigation/paths';
import Pods from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Pods';
import Summary from 'in-kubernetes/Dashboards/DeploymentConfig/tabs/Summary';
import Details from 'in-kubernetes/Dashboards/DeploymentConfig/tabs/Details';

export default [
  {
    label: 'Summary',
    path: `${deploymentConfigDashboardFullyQualified}/summary`,
    component: Summary
  },
  {
    label: 'Details',
    path: `${deploymentConfigDashboardFullyQualified}/details`,
    component: Details
  },
  {
    label: 'Conditions',
    path: `${deploymentConfigDashboardFullyQualified}/conditions`,
    component: Conditions
  },
  {
    label: 'Pods',
    path: `${deploymentConfigDashboardFullyQualified}/pods`,
    component: Pods,
    header: props => getCounterComponent(props, 'pods')
  }
].filter(Boolean);

function getCounterComponent(props, resultPropName) {
  return (
    <TabLabelWithCounter
      label={props.tab.label}
      getCounters={() =>
        getOpenShiftDeploymentConfigItemCounters$({
          deploymentConfigId: props.deploymentConfigId,
          timeConfig: props.timeConfig
        })
      }
      resultPropName={resultPropName}
    />
  );
}
