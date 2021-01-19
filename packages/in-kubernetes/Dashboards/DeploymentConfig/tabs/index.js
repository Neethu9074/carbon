/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { EventsWithoutNamespace } from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Events';
import { DeploymentConfigConditionsTab, WorkloadTab } from 'in-kubernetes/Dashboards/commonComponents/Tabs';
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
    header: DeploymentConfigConditionsTab
  },
  {
    label: 'K8s Services',
    path: `${deploymentConfigDashboardFullyQualified}/services`,
    component: Services,
    header: props => getCounterComponent(props, v => v.services)
  },
  {
    label: 'Pods',
    path: `${deploymentConfigDashboardFullyQualified}/pods`,
    component: Pods,
    header: props => getCounterComponent(props, v => v.pods)
  }
].filter(Boolean);

function getCounterComponent({ deploymentConfigId, tab, timeConfig }, valueExtractor) {
  return (
    <WorkloadTab
      workloadControllerId={deploymentConfigId}
      label={tab.label}
      timeConfig={timeConfig}
      valueExtractor={valueExtractor}
    />
  );
}
