/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { applicationDashboardFullyQualified } from 'in-cloudfoundry/navigation/paths';
import Summary from 'in-cloudfoundry/Dashboards/Application/tabs/Summary';

export default [
  {
    label: 'Summary',
    path: `${applicationDashboardFullyQualified}/summary`,
    component: Summary
  }
];
