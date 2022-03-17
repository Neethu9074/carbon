/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc.
 */

import { instanceDashboardFullyQualified } from 'in-openstack/navigation/paths';
import Summary from 'in-openstack/Dashboards/Instances/tabs/Summary';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-openstack:dashboards.summary'),
    path: `${instanceDashboardFullyQualified}/summary`,
    component: Summary
  }
];
