import {addLabelFinder} from 'in-sdk/snapshot';
import {addIconsToRegistry} from 'in-sdk/iconRegistry';
import * as pluginName from 'in-sdk/pluginName';
import * as sorting from 'in-sdk/sorting';
import * as power from 'in-sdk/power';

import windowsIconPath from 'in-forge/host/icons/instana_server_windows.svg';
import linuxIconPath from 'in-forge/host/icons/instana_server_linux.svg';
import appleIconPath from 'in-forge/host/icons/instana_server_apple.svg';
import * as constants from 'in-forge/constants';

import './metrics';

pluginName.setHumanReadablePluginName(
  constants.plugins.os,
  'Host',
  'Hosts'
);

addLabelFinder(
  constants.plugins.os,
  snapshot => snapshot.getIn(['data', 'fqdn'])
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

addIconsToRegistry([ {
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
