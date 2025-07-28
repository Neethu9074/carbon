/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

// @ts-expect-error needs TS migration
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import metricDefinitions from 'in-forge/plugins/linuxKVMHypervisorHost/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/linuxKVMHypervisorHost/kpiDefinitions';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.linuxKVMHypervisorHost,
  kpiDefinitions,
  metricDefinitions,
  getIconType: () => 'lib_linux_kvm_hypervisor'
});
