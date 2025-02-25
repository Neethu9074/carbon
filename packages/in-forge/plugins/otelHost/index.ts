/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

// @ts-expect-error Module needs to be translated to TS
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import metricDefinitions from 'in-forge/plugins/otelHost/metricDefinitions';
import { plugins } from 'in-forge/constants';

const linuxPlugin = plugins.host + '_linux';
const zosPlugin = plugins.host + '_zos';
const applePlugin = plugins.host + '_apple';
const windowsPlugin = plugins.host + '_windows';
const aixPlugin = plugins.host + '_aix';
const solarisPlugin = plugins.host + '_solaris';

registerSnapshotDefinition({
  plugin: plugins.otelHost,

  showZoneInSidebarHeader: true,
  metricDefinitions,

  getIconType(snapshotOrPlugin: any) {
    if (typeof snapshotOrPlugin === 'object') {
      const os = snapshotOrPlugin.getIn(['data', 'ostype'], '');
      if (os.match(/aix/i)) {
        return aixPlugin;
      } else if (os.match(/solaris/i) || os.match(/sunos/i)) {
        return solarisPlugin;
      } else if (os.match(/linux/i)) {
        return linuxPlugin;
      } else if (os.match(/windows/i)) {
        return windowsPlugin;
      } else if (os.match(/darwin/i)) {
        return applePlugin;
      } else if (os.match(/z\/os/i)) {
        return zosPlugin;
      }
    }
    return linuxPlugin;
  }
});
