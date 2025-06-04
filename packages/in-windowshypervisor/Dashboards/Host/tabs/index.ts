/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

// @ts-expect-error needs migration
import WindowsHypervisorVirtualMachines from 'in-windowshypervisor/Dashboards/Host/tabs/VirtualMachines';
import { hostDashboardFullyQualified } from 'in-windowshypervisor/navigation/paths';
import Summary from 'in-windowshypervisor/Dashboards/Host/tabs/Summary';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-windowshypervisor:summary'),
    path: `${hostDashboardFullyQualified}/summary`,
    component: Summary
  },
  {
    label: t('in-windowshypervisor:virtualMachines'),
    path: `${hostDashboardFullyQualified}/vms`,
    component: WindowsHypervisorVirtualMachines
  }
];
