/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import Summary from 'in-phmc/Dashboards/SharedProcessorPool/tabs/Summary';
import { sppDashboardFullyQualified } from 'in-phmc/navigation/paths';
import Partitions from 'in-phmc/Dashboards/Systems/tabs/Partitions';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-phmc:dashboards.summary'),
    path: `${sppDashboardFullyQualified}/summary`,
    component: Summary
  },
  {
    label: t('in-phmc:dashboards.logicalPartition'),
    path: `${sppDashboardFullyQualified}/partitions`,
    component: Partitions
  }
];
