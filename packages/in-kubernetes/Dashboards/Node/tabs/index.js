/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { NodeConditionsTab, NodePodTab } from 'in-kubernetes/Dashboards/commonComponents/Tabs';
import Conditions from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Conditions';
import Infrastructure from 'in-kubernetes/Dashboards/Node/tabs/Infrastructure';
import { nodeDashboardFullyQualified } from 'in-kubernetes/navigation/paths';
import Pods from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Pods';
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
    header: NodeConditionsTab
  },
  {
    label: 'Pods',
    path: `${nodeDashboardFullyQualified}/pods`,
    component: Pods,
    header: NodePodTab
  },
  {
    label: 'Infrastructure',
    path: `${nodeDashboardFullyQualified}/infrastructure`,
    component: Infrastructure
  }
].filter(Boolean);
