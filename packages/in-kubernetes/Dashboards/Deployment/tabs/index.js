import React from 'react';

import getKubernetesDeploymentItemCounters from 'in-subscription/kubernetes/getKubernetesDeploymentItemCounters';
import ConditionsTabHeader from 'in-kubernetes/Dashboards/commonComponents/commonTabs/ConditionsTabHeader';
import { EventsWithoutNamespace } from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Events';
import TabLabelWithCounter from 'in-kubernetes/Dashboards/commonComponents/TabLabelWithCounter';
import getKubernetesDeployment from 'in-subscription/kubernetes/getKubernetesDeployment';
import Conditions from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Conditions';
import Services from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Services';
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
    label: 'Events',
    path: `${deploymentDashboardFullyQualified}/events`,
    component: EventsWithoutNamespace
  },
  {
    label: 'Conditions',
    path: `${deploymentDashboardFullyQualified}/conditions`,
    component: Conditions,
    header: ConditionsHeader
  },
  {
    label: 'K8s Services',
    path: `${deploymentDashboardFullyQualified}/services`,
    component: Services,
    header: props => getCounterComponent(props, 'services')
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

function ConditionsHeader({ deploymentId, timeConfig }) {
  return (
    <ConditionsTabHeader
      getCounter={() =>
        getKubernetesDeployment({
          id: deploymentId,
          timeConfig
        }).map(result => (result.data ? { data: result.data.conditions } : null))
      }
    />
  );
}
