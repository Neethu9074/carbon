/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { systemDashboardFullyQualified } from 'in-phmc/navigation/paths';
import Partitions from 'in-phmc/Dashboards/Systems/tabs/Partitions';
import Summary from 'in-phmc/Dashboards/Systems/tabs/Summary';
import Vios from 'in-phmc/Dashboards/Systems/tabs/Vios';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-phmc:dashboards.summary'),
    path: `${systemDashboardFullyQualified}/summary`,
    component: Summary
  },
  {
    label: t('in-phmc:dashboards.logicalPartition'),
    path: `${systemDashboardFullyQualified}/partition`,
    component: Partitions
  },
  {
    label: t('in-phmc:dashboards.vios'),
    path: `${systemDashboardFullyQualified}/vios`,
    component: Vios
  }
];
