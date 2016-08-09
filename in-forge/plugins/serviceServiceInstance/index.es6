import {addIconToRegistry} from 'in-sdk/iconRegistry';
import * as pluginName from 'in-sdk/pluginName';
import {addLabelFinder} from 'in-sdk/snapshot';
import * as power from 'in-sdk/power';

import iconPath from 'in-forge/plugins/serviceServiceInstance/icon.svg';
import * as constants from 'in-forge/constants';

pluginName.setHumanReadablePluginName(
  constants.plugins.serviceServiceInstance,
  'Logical Service',
  'Logical Services'
);

addLabelFinder(
  constants.plugins.serviceServiceInstance,
  snapshot => snapshot.getIn(['data', 'service_name'])
);

power.addMapping(
  constants.plugins.serviceServiceInstance,
  () => -1
);

addIconToRegistry({
  id: constants.plugins.serviceServiceInstance,
  image: iconPath
});
