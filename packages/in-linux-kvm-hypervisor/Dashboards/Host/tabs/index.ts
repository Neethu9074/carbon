/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import LinuxKVMHypervisorVirtualMachines from 'in-linux-kvm-hypervisor/Dashboards/Host/tabs/VirtualMachines';
import { hostDashboardFullyQualified } from 'in-linux-kvm-hypervisor/navigation/paths';
import Summary from 'in-linux-kvm-hypervisor/Dashboards/Host/tabs/Summary';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-linux-kvm-hypervisor:summary'),
    path: `${hostDashboardFullyQualified}/summary`,
    component: Summary
  },
  {
    label: t('in-linux-kvm-hypervisor:vms'),
    path: `${hostDashboardFullyQualified}/vms`,
    component: LinuxKVMHypervisorVirtualMachines
  }
];
