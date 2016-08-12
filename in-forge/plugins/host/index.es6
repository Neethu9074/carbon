import {addKeywordOperator, createPluginFieldPath, addSearchableEntityType} from 'in-sdk/search';
import * as pluginName from 'in-sdk/pluginName';
import {addLabelFinder} from 'in-sdk/snapshot';
import * as icon from 'in-sdk/iconRegistry';
import * as sorting from 'in-sdk/sorting';
import * as power from 'in-sdk/power';

import windowsIconPath from 'in-forge/plugins/host/icons/instana_server_windows.svg';
import linuxIconPath from 'in-forge/plugins/host/icons/instana_server_linux.svg';
import appleIconPath from 'in-forge/plugins/host/icons/instana_server_apple.svg';
import * as constants from 'in-forge/constants';

import './metrics';

pluginName.setHumanReadablePluginName(
  constants.plugins.os,
  'Host',
  'Hosts'
);

addLabelFinder(
  constants.plugins.os,
  snapshot => snapshot.getIn(['data', 'fqdn'], snapshot.getIn(['data', 'hostname']))
);

power.addMapping(
  constants.plugins.os,
  snapshot => {
    const data = snapshot.get('data');
    return data.get('memory.total', 1) * data.get('cpu.count', 1);
  }
);

sorting.addMapping(
  constants.plugins.os,
  (s1, s2) => s1.get('hostId').localeCompare(s2.get('hostId'))
);

icon.addIconsToRegistry([ {
    id: constants.plugins.os + '_linux',
    image: linuxIconPath
  }, {
    id: constants.plugins.os + '_apple',
    image: appleIconPath
  }, {
    id: constants.plugins.os + '_windows',
    image: windowsIconPath
  }
]);

icon.addMapping(
  constants.plugins.os,
  snapshot => {
    let type = snapshot.get('plugin');

    const osPlugin = constants.plugins.os;
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
  }
);

addKeywordOperator({
  context: 'entity',
  type: 'number',
  keyword: 'host.cpuCount',
  field: createPluginFieldPath(constants.plugins.os, ['cpuCount'])
});

addKeywordOperator({
  context: 'entity',
  type: 'string',
  keyword: 'host.hostname',
  field: createPluginFieldPath(constants.plugins.os, ['hostname'])
});

addKeywordOperator({
  context: 'entity',
  type: 'string',
  keyword: 'host.fqdn',
  field: createPluginFieldPath(constants.plugins.os, ['fqdn'])
});

addKeywordOperator({
  context: 'entity',
  type: 'number',
  keyword: 'host.memory',
  field: createPluginFieldPath(constants.plugins.os, ['memory'])
});

addSearchableEntityType('host', constants.plugins.os);
