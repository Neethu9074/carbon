import iconPath from 'in-forge/plugins/hAProxy/icon.svg';
import {addIconToRegistry} from 'in-sdk/iconRegistry';
import {addSearchableEntityType} from 'in-sdk/search';
import * as constants from 'in-forge/constants';
import * as pluginName from 'in-sdk/pluginName';
import {addLabelFinder} from 'in-sdk/snapshot';


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

addIconToRegistry({
  id: constants.plugins.haproxy,
  image: iconPath
});

addSearchableEntityType('haproxy', constants.plugins.haproxy);
