/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { regionDashboardFullyQualified } from 'in-openstack/navigation/paths';
import Summary from 'in-openstack/Dashboards/Hypervisors/tabs/Summary';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-openstack:dashboards.summary'),
    path: `${regionDashboardFullyQualified}/summary`,
    component: Summary
  }
];
