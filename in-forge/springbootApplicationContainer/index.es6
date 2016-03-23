import {addIconToRegistry} from 'in-sdk/iconRegistry';
import * as pluginName from 'in-sdk/pluginName';
import {addLabelFinder} from 'in-sdk/snapshot';
import * as power from 'in-sdk/power';

import iconPath from 'in-forge/springbootApplicationContainer/icon.svg';
import * as constants from 'in-forge/constants';

pluginName.setHumanReadablePluginName(
  constants.plugins.springboot,
  'Springboot',
  'Springboot'
);

addLabelFinder(
  constants.plugins.springboot,
  snapshot => snapshot.getIn(['data', 'version'])
);

power.addMapping(
  constants.plugins.springboot,
  () => -1
);

addIconToRegistry({
  id: constants.plugins.springboot,
  image: iconPath
});
