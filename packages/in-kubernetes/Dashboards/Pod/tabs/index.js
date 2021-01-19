/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import Conditions from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Conditions';
import Events from 'in-kubernetes/Dashboards/commonComponents/commonTabs/Events';
import Infrastructure from 'in-kubernetes/Dashboards/Pod/tabs/Infrastructure';
import { podDashboardFullyQualified } from 'in-kubernetes/navigation/paths';
import { PodConditionsTab } from 'in-kubernetes/Dashboards/commonComponents/Tabs';
import Summary from 'in-kubernetes/Dashboards/Pod/tabs/Summary/Summary';
import Details from 'in-kubernetes/Dashboards/Pod/tabs/Details/Details';

export default [
  {
    label: 'Summary',
    path: `${podDashboardFullyQualified}/summary`,
    component: Summary
  },
  {
    label: 'Details',
    path: `${podDashboardFullyQualified}/details`,
    component: Details
  },
  {
    label: 'Conditions',
    path: `${podDashboardFullyQualified}/conditions`,
    component: Conditions,
    header: PodConditionsTab
  },
  {
    label: 'Events',
    path: `${podDashboardFullyQualified}/events`,
    component: Events
  },
  {
    label: 'Containers',
    path: `${podDashboardFullyQualified}/containers`,
    component: Infrastructure
  }
].filter(Boolean);
