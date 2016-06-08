import {addIconToRegistry} from 'in-sdk/iconRegistry';
import * as pluginName from 'in-sdk/pluginName';
import {addLabelFinder} from 'in-sdk/snapshot';
import * as power from 'in-sdk/power';

import iconPath from 'in-forge/plugins/dummyConnection/icon.svg';
import * as constants from 'in-forge/constants';

pluginName.setHumanReadablePluginName(
  constants.plugins.dummyConnection,
  'Connection',
  'Connections'
);

addLabelFinder(
  constants.plugins.dummyConnection,
  snapshot => snapshot.getIn(['data', 'label'])
);

power.addMapping(
  constants.plugins.dummyConnection,
  () => -1
);

addIconToRegistry({
  id: constants.plugins.dummyConnection,
  image: iconPath
});
