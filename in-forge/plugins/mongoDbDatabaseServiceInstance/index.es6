import {addIconToRegistry} from 'in-sdk/iconRegistry';
import * as pluginName from 'in-sdk/pluginName';
import {addLabelFinder} from 'in-sdk/snapshot';

import * as constants from 'in-forge/constants';

import iconPath from './icon.svg';

pluginName.setHumanReadablePluginName(
  constants.plugins.mongoDbDatabaseServiceInstance,
  'Logical MongoDB Database',
  'Logical MongoDB Databases'
);

addLabelFinder(
  constants.plugins.mongoDbDatabaseServiceInstance,
  snapshot => snapshot.getIn(['data', 'name'])
);

addIconToRegistry({
  id: constants.plugins.mongoDbDatabaseServiceInstance,
  image: iconPath
});
