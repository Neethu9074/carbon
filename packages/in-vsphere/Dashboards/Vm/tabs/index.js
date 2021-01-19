/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import Infrastructure from 'in-vsphere/Dashboards/Vm/tabs/Infrastructure';
import { vmDashboardFullyQualified } from 'in-vsphere/navigation/paths';
import Summary from 'in-vsphere/Dashboards/Vm/tabs/Summary';

export default [
  {
    label: 'Summary',
    path: `${vmDashboardFullyQualified}/summary`,
    component: Summary
  },
  {
    label: 'Infrastructure',
    path: `${vmDashboardFullyQualified}/infrastructure`,
    component: Infrastructure
  }
];
