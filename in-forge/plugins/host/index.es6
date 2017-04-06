import { registerSnapshotDefinition } from 'in-sdk/snapshot';

import windowsIconSvgPath from 'in-forge/plugins/host/icons/windowsIconPath';
import linuxIconSvgPath from 'in-forge/plugins/host/icons/linuxIconPath';
import appleIconSvgPath from 'in-forge/plugins/host/icons/appleIconPath';
import tableDefinition from 'in-forge/plugins/host/tableDefinition.es6';
import metricDefinitions from 'in-forge/plugins/host/metricDefinitions';
import { plugins } from 'in-forge/constants';
import 'in-forge/plugins/host/metrics';

const linuxPlugin = plugins.host + '_linux';
const applePlugin = plugins.host + '_apple';
const windowsPlugin = plugins.host + '_windows';
const aixPlugin = plugins.host + '_aix';

registerSnapshotDefinition({
  plugin: plugins.host,
  pluginName: {
    singular: 'Host',
    plural: 'Hosts'
  },
  showZoneInSidebarHeader: true,
  tableDefinition,
  metricDefinitions,

  icons: {
    [plugins.host]: linuxIconSvgPath,
    [linuxPlugin]: linuxIconSvgPath,
    [applePlugin]: appleIconSvgPath,
    [windowsPlugin]: windowsIconSvgPath,
    // TODO Simon: Put the right icon here!
    [aixPlugin]: linuxIconSvgPath
  },

  getIconPath(snapshot) {
    const os = snapshot.getIn(['data', 'os.name'], '');
    if (os.match(/aix/i)) {
      return aixPlugin;
    } else if (os.match(/linux/i)) {
      return linuxPlugin;
    } else if (os.match(/windows/i)) {
      return windowsPlugin;
    } else if (os.match(/mac/i)) {
      return applePlugin;
    }
    return linuxPlugin;
  },

  getPower(snapshot) {
    const data = snapshot.get('data');
    return data.get('memory.total', 1) * data.get('cpu.count', 1);
  }
});
