import {addKeywordOperator, createPluginFieldPath} from 'in-sdk/search';
import {registerSnapshotDefinition} from 'in-sdk/snapshot';

import windowsIconPath from 'in-forge/plugins/host/icons/instana_server_windows.svg';
import linuxIconPath from 'in-forge/plugins/host/icons/instana_server_linux.svg';
import appleIconPath from 'in-forge/plugins/host/icons/instana_server_apple.svg';
import tableDefinition from 'in-forge/plugins/host/tableDefinition.es6';
import metricDefinitions from 'in-forge/plugins/host/metricDefinitions';
import {plugins} from 'in-forge/constants';
import 'in-forge/plugins/host/metrics';

registerSnapshotDefinition({
  plugin: plugins.host,
  pluginName: {
    singular: 'Host',
    plural: 'Hosts'
  },
  showZoneInSidebarHeader: true,
  tableDefinition,
  metricDefinitions,

  namesForTypeSearch: ['host'],

  icons: {
    [plugins.host + '_linux']: linuxIconPath,
    [plugins.host + '_apple']: appleIconPath,
    [plugins.host + '_windows']: windowsIconPath
  },

  getIcon(snapshot) {
    let type = snapshot.get('plugin');

    const osPlugin = plugins.host;
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
  field: createPluginFieldPath(plugins.host, ['cpuCount'])
});

addKeywordOperator({
  context: 'entity',
  type: 'string',
  keyword: 'host.hostname',
  field: createPluginFieldPath(plugins.host, ['hostname'])
});

addKeywordOperator({
  context: 'entity',
  type: 'string',
  keyword: 'host.fqdn',
  field: createPluginFieldPath(plugins.host, ['fqdn'])
});

addKeywordOperator({
  context: 'entity',
  type: 'number',
  keyword: 'host.memory',
  field: createPluginFieldPath(plugins.host, ['memory'])
});
