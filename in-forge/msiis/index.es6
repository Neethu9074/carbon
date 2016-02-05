import {addIconToRegistry} from 'in-sdk/iconRegistry';
import * as pluginName from 'in-sdk/pluginName';
import {addLabelFinder} from 'in-sdk/snapshot';
import * as power from 'in-sdk/power';

import iconPath from './icon.svg';
import * as constants from '../constants';

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
