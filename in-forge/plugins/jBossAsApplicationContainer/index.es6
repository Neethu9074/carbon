import {addIconToRegistry} from 'in-sdk/iconRegistry';
import * as pluginName from 'in-sdk/pluginName';
import {addLabelFinder} from 'in-sdk/snapshot';
import * as power from 'in-sdk/power';

import iconPath from 'in-forge/plugins/jBossAsApplicationContainer/icon.svg';
import * as constants from 'in-forge/constants';

pluginName.setHumanReadablePluginName(
  constants.plugins.jbossas,
  'JBoss AS',
  'JBoss AS'
);

addLabelFinder(
  constants.plugins.jbossas,
  snapshot => {
    const serverInfo = snapshot.getIn(['data', 'serverInfo']);
    let label = 'JBoss AS';
    label += ' ' + serverInfo.get('releaseVersion');
    if (serverInfo.get('productName')) {
      label += ' ' + serverInfo.get('productName') + ' ';
    }
    const sockets = snapshot.getIn(['data', 'sockets']);
    if (sockets && sockets.size > 0) {
      label += ' @ ' + sockets.map(data => data.get('port')).join(', ');
    }
    return label;
  }
);

power.addMapping(
  constants.plugins.jbossas,
  () => -1
);

addIconToRegistry({
  id: constants.plugins.jbossas,
  image: iconPath
});
