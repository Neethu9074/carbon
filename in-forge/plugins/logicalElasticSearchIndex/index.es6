import {addIconToRegistry} from 'in-sdk/iconRegistry';
import * as pluginName from 'in-sdk/pluginName';
import {addLabelFinder} from 'in-sdk/snapshot';

import iconPath from 'in-forge/plugins/logicalElasticSearchIndex/icon.svg';
import * as constants from 'in-forge/constants';

pluginName.setHumanReadablePluginName(
  constants.plugins.logicalElasticSearchIndex,
  'Logical Elasticsearch Index',
  'Logical Elasticsearch Indices'
);

addLabelFinder(
  constants.plugins.logicalElasticSearchIndex,
  snapshot => snapshot.getIn(['data', 'service_name'])
);

addIconToRegistry({
  id: constants.plugins.logicalElasticSearchIndex,
  image: iconPath
});
