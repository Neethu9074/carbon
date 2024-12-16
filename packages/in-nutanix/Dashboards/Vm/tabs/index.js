/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import Infrastructure from 'in-nutanix/Dashboards/Vm/tabs/Infrastructure';
import { vmDashboardFullyQualified } from 'in-nutanix/navigation/paths';
import Summary from 'in-nutanix/Dashboards/Vm/tabs/Summary';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-nutanix:dashboards.summary'),
    path: `${vmDashboardFullyQualified}/summary`,
    component: Summary
  },
  {
    label: t('in-nutanix:dashboards.infrastructure'),
    path: `${vmDashboardFullyQualified}/infrastructure`,
    component: Infrastructure
  }
];
