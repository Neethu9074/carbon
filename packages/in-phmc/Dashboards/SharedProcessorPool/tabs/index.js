/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import Summary from 'in-phmc/Dashboards/SharedProcessorPool/tabs/Summary';
import { sppDashboardFullyQualified } from 'in-phmc/navigation/paths';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-phmc:dashboards.summary'),
    path: `${sppDashboardFullyQualified}/summary`,
    component: Summary
  }
];
