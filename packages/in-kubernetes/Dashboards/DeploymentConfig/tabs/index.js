import React from 'react';

import getKubernetesWorkloadControllerItemCounters from 'in-subscription/kubernetes/getKubernetesWorkloadControllerItemCounters';
import ConditionsTabHeader from 'in-kubernetes/Dashboards/commonComponents/commonTabs/ConditionsTabHeader';
import { EventsWithoutNamespace } from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Events';
import getKubernetesWorkloadController from 'in-subscription/kubernetes/getKubernetesWorkloadController';
import TabLabelWithCounter from 'in-kubernetes/Dashboards/commonComponents/TabLabelWithCounter';
import Conditions from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Conditions';
import { deploymentConfigDashboardFullyQualified } from 'in-kubernetes/navigation/paths';
import Services from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Services';
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
    label: 'Events',
    path: `${deploymentConfigDashboardFullyQualified}/events`,
    component: EventsWithoutNamespace
  },
  {
    label: 'Conditions',
    path: `${deploymentConfigDashboardFullyQualified}/conditions`,
    component: Conditions,
    header: ConditionsHeader
  },
  {
    label: 'K8s Services',
    path: `${deploymentConfigDashboardFullyQualified}/services`,
    component: Services,
    header: props => getCounterComponent(props, 'services')
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
        getKubernetesWorkloadControllerItemCounters({
          workloadControllerId: props.deploymentConfigId,
          timeConfig: props.timeConfig
        })
      }
      resultPropName={resultPropName}
    />
  );
}

function ConditionsHeader({ deploymentConfigId, timeConfig }) {
  return (
    <ConditionsTabHeader
      getCounter={() =>
        getKubernetesWorkloadController({
          id: deploymentConfigId,
          timeConfig
        }).map(result => (result.data ? { data: result.data.conditions } : null))
      }
    />
  );
}
