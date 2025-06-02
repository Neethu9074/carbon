/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { vmDashboardFullyQualified } from 'in-xenserver/navigation/paths';
import Summary from 'in-xenserver/Dashboards/VM/tabs/Summary';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-xenserver:summary'),
    path: `${vmDashboardFullyQualified}/summary`,
    component: Summary
  }
];
