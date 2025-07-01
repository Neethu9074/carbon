/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

// @ts-expect-error needs TS migration
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import metricDefinitions from 'in-forge/plugins/xenServerVM/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/xenServerVM/kpiDefinitions';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { plugins } from 'in-forge/constants';

const linuxIcon = 'linux';
const windowsIcon = 'windows';

registerSnapshotDefinition({
  plugin: plugins.xenServerVM,
  kpiDefinitions,
  metricDefinitions,
  getIconType(snapshot: SnapshotData) {
    if (typeof snapshot === 'object') {
      const os = snapshot.getIn(['data', 'name'], '');
      if (os.match(/linux/i)) {
        return linuxIcon;
      } else if (os.match(/windows/i)) {
        return windowsIcon;
      }
    }
    return linuxIcon;
  }
});
