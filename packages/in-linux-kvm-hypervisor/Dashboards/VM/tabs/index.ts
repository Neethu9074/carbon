/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { vmDashboardFullyQualified } from 'in-linux-kvm-hypervisor/navigation/paths';
import Summary from 'in-linux-kvm-hypervisor/Dashboards/VM/tabs/Summary';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-linux-kvm-hypervisor:summary'),
    path: `${vmDashboardFullyQualified}/summary`,
    component: Summary
  }
];
