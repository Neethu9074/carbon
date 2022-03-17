/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc.
 */

import ComputeInstances from 'in-openstack/Dashboards/Regions/tabs/ComputeInstances';
import { regionDashboardFullyQualified } from 'in-openstack/navigation/paths';
import Hypervisors from 'in-openstack/Dashboards/Regions/tabs/Hypervisors';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-openstack:dashboards.hypervisors'),
    path: `${regionDashboardFullyQualified}/hypervisors`,
    component: Hypervisors
  },
  {
    label: t('in-openstack:dashboards.computeInstances'),
    path: `${regionDashboardFullyQualified}/computeInstances`,
    component: ComputeInstances
  }
];
