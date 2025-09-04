/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

// @ts-expect-error needs TS migration
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import metricDefinitions from 'in-forge/plugins/linuxKVMHypervisorVM/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/linuxKVMHypervisorVM/kpiDefinitions';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { plugins } from 'in-forge/constants';

const linuxIcon = 'linux';
const windowsIcon = 'windows';

registerSnapshotDefinition({
  plugin: plugins.linuxKVMHypervisorVM,
  kpiDefinitions,
  metricDefinitions,
  getIconType(snapshot: SnapshotData) {
    if (typeof snapshot === 'object') {
      const os = snapshot.getIn(['data', 'os'], '');
      if (os.match(/windows/i) || os.match(/win/i)) {
        return windowsIcon;
      }
    }
    return linuxIcon;
  }
});
