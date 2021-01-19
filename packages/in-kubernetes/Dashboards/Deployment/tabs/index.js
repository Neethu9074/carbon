/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { EventsWithoutNamespace } from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Events';
import { DeploymentConditionsTab, WorkloadTab } from 'in-kubernetes/Dashboards/commonComponents/Tabs';
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
    header: DeploymentConditionsTab
  },
  {
    label: 'K8s Services',
    path: `${deploymentDashboardFullyQualified}/services`,
    component: Services,
    header: props => getCounterComponent(props, v => v.services)
  },
  {
    label: 'Pods',
    path: `${deploymentDashboardFullyQualified}/pods`,
    component: Pods,
    header: props => getCounterComponent(props, v => v.pods)
  }
].filter(Boolean);

function getCounterComponent({ deploymentId, tab, timeConfig }, valueExtractor) {
  return (
    <WorkloadTab
      workloadControllerId={deploymentId}
      label={tab.label}
      timeConfig={timeConfig}
      valueExtractor={valueExtractor}
    />
  );
}
