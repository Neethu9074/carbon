import iconPath from 'in-forge/plugins/hAProxy/icon.svg';
import {addIconToRegistry} from 'in-sdk/iconRegistry';
import {addSearchableType} from 'in-sdk/search';
import * as constants from 'in-forge/constants';
import * as pluginName from 'in-sdk/pluginName';
import {addLabelFinder} from 'in-sdk/snapshot';
import * as power from 'in-sdk/power';


pluginName.setHumanReadablePluginName(
  constants.plugins.haproxy,
  'HAProxy',
  'HAProxy'
);

addLabelFinder(
  constants.plugins.haproxy,
    snapshot => {
    const pid = snapshot.getIn(['data', 'pid']);
    return 'HAProxy @' + pid;
  }
);

power.addMapping(
  constants.plugins.haproxy,
  () => -1
);

addIconToRegistry({
  id: constants.plugins.haproxy,
  image: iconPath
});

addSearchableType('haproxy', constants.plugins.haproxy);
