import {addIconToRegistry} from 'in-sdk/iconRegistry';
import * as pluginName from 'in-sdk/pluginName';
import {addLabelFinder} from 'in-sdk/snapshot';
import * as power from 'in-sdk/power';

import iconPath from 'in-forge/plugins/elasticSearchIndexServiceInstance/icon.svg';
import * as constants from 'in-forge/constants';

pluginName.setHumanReadablePluginName(
  constants.plugins.elasticSearchIndexServiceInstance,
  'Logical Elastic Search Index',
  'Logical Elastic Search Indices'
);

addLabelFinder(
  constants.plugins.elasticSearchIndexServiceInstance,
  snapshot => snapshot.getIn(['data', 'service_name'])
);

power.addMapping(
  constants.plugins.elasticSearchIndexServiceInstance,
  () => -1
);

addIconToRegistry({
  id: constants.plugins.elasticSearchIndexServiceInstance,
  image: iconPath
});
