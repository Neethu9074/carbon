import {addIconToRegistry} from 'in-sdk/iconRegistry';
import * as pluginName from 'in-sdk/pluginName';
import {addLabelFinder} from 'in-sdk/snapshot';
import * as power from 'in-sdk/power';

import iconPath from 'in-forge/plugins/springbootApplicationContainer/icon.svg';
import * as constants from 'in-forge/constants';

pluginName.setHumanReadablePluginName(
  constants.plugins.springboot,
  'Springboot',
  'Springboot'
);

addLabelFinder(
  constants.plugins.springboot,
  snapshot => {
    const data = snapshot.get('data');
    const portsMap = data.get('ports');
    const appName = data.get('name');
    const version = data.get('version');
    let label = 'Springboot';
    if (appName) {
      label = appName;
      if (version) {
        label += ' ' + version;
      }
    }
    if (portsMap && portsMap.size > 0) {
      const ports = portsMap.valueSeq().join(', ');
      label += ' @' + ports;
    }
    return label;
  }
);

power.addMapping(
  constants.plugins.springboot,
  () => -1
);

addIconToRegistry({
  id: constants.plugins.springboot,
  image: iconPath
});
