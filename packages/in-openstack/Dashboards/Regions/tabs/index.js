/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc.
 */

import ComputeInstances from 'in-openstack/Dashboards/Regions/tabs/ComputeInstances';
import { regionDashboardFullyQualified } from 'in-openstack/navigation/paths';
import Hypervisors from 'in-openstack/Dashboards/Regions/tabs/Hypervisors';
import Flavor from 'in-openstack/Dashboards/Regions/tabs/Flavor';
import Image from 'in-openstack/Dashboards/Regions/tabs/Image';
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
  },
  {
    label: t('in-openstack:dashboards.flavors'),
    path: `${regionDashboardFullyQualified}/flavor`,
    component: Flavor
  },
  {
    label: t('in-openstack:dashboards.images'),
    path: `${regionDashboardFullyQualified}/image`,
    component: Image
  }
];
