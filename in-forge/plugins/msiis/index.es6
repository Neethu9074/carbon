import iconPath from 'in-forge/plugins/msiis/icon.svg';
import {addIconToRegistry} from 'in-sdk/iconRegistry';
import * as pluginName from 'in-sdk/pluginName';
import * as constants from 'in-forge/constants';
import {addSearchableEntityType} from 'in-sdk/search';
import {addLabelFinder} from 'in-sdk/snapshot';
import * as power from 'in-sdk/power';

pluginName.setHumanReadablePluginName(
  constants.plugins.msiis,
  'Internet Information Server',
  'Internet Information Servers'
);

addLabelFinder(
  constants.plugins.msiis,
  snapshot => 'IIS ' + snapshot.getIn(['data', 'iis.version'])
);

power.addMapping(
  constants.plugins.msiis,
  () => -1
);

addIconToRegistry({
  id: constants.plugins.msiis,
  image: iconPath
});

addSearchableEntityType('msiis', constants.plugins.msiis);
addSearchableEntityType('iis', constants.plugins.msiis);
