/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { hostDashboardFullyQualified } from 'in-linuxkvmhypervisor/navigation/paths';
import Summary from 'in-linuxkvmhypervisor/Dashboards/Host/tabs/Summary';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-linuxkvmhypervisor:summary'),
    path: `${hostDashboardFullyQualified}/summary`,
    component: Summary
  }
];
