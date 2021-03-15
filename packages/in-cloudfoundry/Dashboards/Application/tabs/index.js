/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { applicationDashboardFullyQualified } from 'in-cloudfoundry/navigation/paths';
import Summary from 'in-cloudfoundry/Dashboards/Application/tabs/Summary';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-cloudfoundry:dashboards.summary'),
    path: `${applicationDashboardFullyQualified}/summary`,
    component: Summary
  }
];
