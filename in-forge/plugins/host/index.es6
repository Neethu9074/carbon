import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { addKeywordOperator } from 'in-sdk/search';

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
    [plugins.host]: linuxIconSvgPath,
    [linuxPlugin]: linuxIconSvgPath,
    [applePlugin]: appleIconSvgPath,
    [windowsPlugin]: windowsIconSvgPath
  },

  getIconPath(snapshot) {
    const os = snapshot.getIn(['data', 'os.name'], '');
    if (os.match(/linux/i)) {
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

addKeywordOperator({
  context: 'entity',
  type: 'number',
  keyword: 'cpuCount',
  field: 'cpuCount'
});

addKeywordOperator({
  context: 'entity',
  type: 'string',
  keyword: 'hostname',
  field: 'hostname'
});

addKeywordOperator({
  context: 'entity',
  type: 'string',
  keyword: 'fqdn',
  field: 'fqdn'
});

addKeywordOperator({
  context: 'entity',
  type: 'number',
  keyword: 'memory',
  field: 'memory'
});
