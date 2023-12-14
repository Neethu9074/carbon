/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import ComputeInstances from 'in-powervc/Dashboards/Regions/tabs/ComputeInstances';
import { powervcRegionDashboardFullyQualified } from 'in-powervc/navigation/paths';
import Hypervisors from 'in-powervc/Dashboards/Regions/tabs/Hypervisors';
import Summary from 'in-powervc/Dashboards/Regions/tabs//Summary';
import Flavor from 'in-openstack/Dashboards/Regions/tabs/Flavor';
import Storage from 'in-powervc/Dashboards/Regions/tabs/Storage';
import Image from 'in-openstack/Dashboards/Regions/tabs/Image';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-powervc:dashboards.summary'),
    path: `${powervcRegionDashboardFullyQualified}/summary`,
    component: Summary
  },
  {
    label: t('in-powervc:dashboards.hypervisors'),
    path: `${powervcRegionDashboardFullyQualified}/hypervisors`,
    component: Hypervisors
  },
  {
    label: t('in-powervc:dashboards.computeInstances'),
    path: `${powervcRegionDashboardFullyQualified}/computeInstances`,
    component: ComputeInstances
  },
  {
    label: t('in-powervc:dashboards.storage'),
    path: `${powervcRegionDashboardFullyQualified}/storage`,
    component: Storage
  },
  {
    label: t('in-powervc:dashboards.flavors'),
    path: `${powervcRegionDashboardFullyQualified}/flavor`,
    component: Flavor
  },
  {
    label: t('in-powervc:dashboards.images'),
    path: `${powervcRegionDashboardFullyQualified}/image`,
    component: Image
  }
];
