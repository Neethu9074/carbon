/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { EventsWithoutNamespace } from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Events';
import { WorkloadTab } from 'in-kubernetes/Dashboards/commonComponents/Tabs';
import Services from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Services';
import { daemonSetDashboardFullyQualified } from 'in-kubernetes/navigation/paths';
import Nodes from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Nodes';
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
    label: 'Nodes',
    path: `${daemonSetDashboardFullyQualified}/nodes`,
    component: Nodes,
    header: props => getCounterComponent(props, v => v.nodes)
  },
  {
    label: 'K8s Services',
    path: `${daemonSetDashboardFullyQualified}/services`,
    component: Services,
    header: props => getCounterComponent(props, v => v.services)
  },
  {
    label: 'Pods',
    path: `${daemonSetDashboardFullyQualified}/pods`,
    component: Pods,
    header: props => getCounterComponent(props, v => v.pods)
  }
].filter(Boolean);

function getCounterComponent({ workloadControllerId, tab, timeConfig }, valueExtractor) {
  return (
    <WorkloadTab
      workloadControllerId={workloadControllerId}
      label={tab.label}
      timeConfig={timeConfig}
      valueExtractor={valueExtractor}
    />
  );
}
