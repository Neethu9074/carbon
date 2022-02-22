/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

// import TabLabelWithCounter from 'in-openstack/Dashboards/commonComponents/TabLabelWithCounter';
import Hypervisors from 'in-openstack/Dashboards/Regions/tabs/Hypervisors';
import { regionDashboardFullyQualified } from 'in-openstack/navigation/paths';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-openstack:dashboards.hypervisors'),
    path: `${regionDashboardFullyQualified}/hypervisors`,
    component: Hypervisors
  }
];
