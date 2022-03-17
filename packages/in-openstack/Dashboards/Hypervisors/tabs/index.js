/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc.
 */

import { hypervisorDashboardFullyQualified } from 'in-openstack/navigation/paths';
import Summary from 'in-openstack/Dashboards/Hypervisors/tabs/Summary';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-openstack:dashboards.summary'),
    path: `${hypervisorDashboardFullyQualified}/summary`,
    component: Summary
  }
];
