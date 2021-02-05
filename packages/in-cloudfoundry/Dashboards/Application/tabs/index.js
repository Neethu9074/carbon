/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

import { applicationDashboardFullyQualified } from 'in-cloudfoundry/navigation/paths';
import Summary from 'in-cloudfoundry/Dashboards/Application/tabs/Summary';

export default [
  {
    label: t('in-cloudfoundry:dashboards.summary'),
    path: `${applicationDashboardFullyQualified}/summary`,
    component: Summary
  }
];
