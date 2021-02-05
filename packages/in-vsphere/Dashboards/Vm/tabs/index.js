/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

import Infrastructure from 'in-vsphere/Dashboards/Vm/tabs/Infrastructure';
import { vmDashboardFullyQualified } from 'in-vsphere/navigation/paths';
import Summary from 'in-vsphere/Dashboards/Vm/tabs/Summary';

export default [
  {
    label: t('in-vsphere:dashboards.summary'),
    path: `${vmDashboardFullyQualified}/summary`,
    component: Summary
  },
  {
    label: t('in-vsphere:dashboards.infrastructure'),
    path: `${vmDashboardFullyQualified}/infrastructure`,
    component: Infrastructure
  }
];
