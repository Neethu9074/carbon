import {addIconToRegistry} from 'in-sdk/iconRegistry';
import * as pluginName from 'in-sdk/pluginName';
import {addLabelFinder} from 'in-sdk/snapshot';
import * as power from 'in-sdk/power';

import iconPath from 'in-forge/plugins/elasticSearchIndexServiceInstance/icon.svg';
import * as constants from 'in-forge/constants';

pluginName.setHumanReadablePluginName(
  constants.plugins.elasticSearchIndexServiceInstance,
  'Elasticsearch Index Instance',
  'Elasticsearch Index Instances'
);

addLabelFinder(
  constants.plugins.elasticSearchIndexServiceInstance,
  snapshot => snapshot.getIn(['data', 'name'])
);

power.addMapping(
  constants.plugins.elasticSearchIndexServiceInstance,
  () => -1
);

addIconToRegistry({
  id: constants.plugins.elasticSearchIndexServiceInstance,
  image: iconPath
});
