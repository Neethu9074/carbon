import {addIconToRegistry} from 'in-sdk/iconRegistry';
import * as pluginName from 'in-sdk/pluginName';
import {addLabelFinder} from 'in-sdk/snapshot';
import * as power from 'in-sdk/power';

import iconPath from 'in-forge/plugins/logicalElasticSearchIndex/icon.svg';
import * as constants from 'in-forge/constants';

pluginName.setHumanReadablePluginName(
  constants.plugins.logicalElasticSearchIndex,
  'Logical Rabbit MQ Connection',
  'Logical Rabbit MQ Connections'
);

addLabelFinder(
  constants.plugins.logicalElasticSearchIndex,
  snapshot => snapshot.getIn(['data', 'service_name'])
);

power.addMapping(
  constants.plugins.logicalElasticSearchIndex,
  () => -1
);

addIconToRegistry({
  id: constants.plugins.logicalElasticSearchIndex,
  image: iconPath
});
