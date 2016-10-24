import {addKeywordOperator, createPluginFieldPath} from 'in-sdk/search';
import {registerSnapshotDefinition} from 'in-sdk/snapshot';

import windowsIconPath from 'in-forge/plugins/host/icons/instana_server_windows.svg';
import linuxIconPath from 'in-forge/plugins/host/icons/instana_server_linux.svg';
import appleIconPath from 'in-forge/plugins/host/icons/instana_server_apple.svg';
import tableDefinition from 'in-forge/plugins/host/tableDefinition';
import {plugins} from 'in-forge/constants';
import 'in-forge/plugins/host/metrics';

registerSnapshotDefinition({
  plugin: plugins.os,
  pluginName: {
    singular: 'Host',
    plural: 'Hosts'
  },
  showZoneInSidebarHeader: true,
  tableDefinition,

  namesForTypeSearch: ['host'],

  icons: {
    [plugins.os + '_linux']: linuxIconPath,
    [plugins.os + '_apple']: appleIconPath,
    [plugins.os + '_windows']: windowsIconPath
  },

  getIcon(snapshot) {
    let type = snapshot.get('plugin');

    const osPlugin = plugins.os;
    if (type === osPlugin) {
      const os = snapshot.getIn(['data', 'os.name']);
      type = osPlugin + '_linux'; // linux as default

      if (os) {
        if (os.match(/linux/i)) {
          type = osPlugin + '_linux';
        } else if (os.match(/windows/i)) {
          type = osPlugin + '_windows';
        } else if (os.match(/mac/i)) {
          type = osPlugin + '_apple';
        }
      }
    }
    return type;
  },

  getPower(snapshot) {
    const data = snapshot.get('data');
    return data.get('memory.total', 1) * data.get('cpu.count', 1);
  },

  getLabel(snapshot) {
    return snapshot.getIn(['data', 'fqdn'], snapshot.getIn(['data', 'hostname']));
  }
});

addKeywordOperator({
  context: 'entity',
  type: 'number',
  keyword: 'host.cpuCount',
  field: createPluginFieldPath(plugins.os, ['cpuCount'])
});

addKeywordOperator({
  context: 'entity',
  type: 'string',
  keyword: 'host.hostname',
  field: createPluginFieldPath(plugins.os, ['hostname'])
});

addKeywordOperator({
  context: 'entity',
  type: 'string',
  keyword: 'host.fqdn',
  field: createPluginFieldPath(plugins.os, ['fqdn'])
});

addKeywordOperator({
  context: 'entity',
  type: 'number',
  keyword: 'host.memory',
  field: createPluginFieldPath(plugins.os, ['memory'])
});
