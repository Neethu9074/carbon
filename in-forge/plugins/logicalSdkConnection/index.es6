import {addIconToRegistry} from 'in-sdk/iconRegistry';
import * as pluginName from 'in-sdk/pluginName';
import {addLabelFinder} from 'in-sdk/snapshot';
import * as power from 'in-sdk/power';

import iconPath from 'in-forge/plugins/logicalSdkConnection/icon.svg';
import * as constants from 'in-forge/constants';

pluginName.setHumanReadablePluginName(
  constants.plugins.logicalHttpConnection,
  'Custom Logical Connection',
  'Custom Logical Connections'
);

addLabelFinder(
  constants.plugins.logicalSdkConnection,
  snapshot => snapshot.getIn(['data', 'source', 'service_name']) +
              ' to ' +
              snapshot.getIn(['data', 'destination', 'service_name'])
);

power.addMapping(
  constants.plugins.logicalSdkConnection,
  () => -1
);

addIconToRegistry({
  id: constants.plugins.logicalSdkConnection,
  image: iconPath
});
