import {addIconToRegistry} from 'in-sdk/iconRegistry';
import {addSearchableEntityType} from 'in-sdk/search';
import {setHumanReadablePluginName} from 'in-sdk/pluginName';
import {addLabelFinder} from 'in-sdk/snapshot';

import iconPath from 'in-forge/plugins/mongoDb/icon.svg';
import {plugins} from 'in-forge/constants';

setHumanReadablePluginName(
  plugins.mongodb,
  'MongoDB Node',
  'MongoDB Nodes'
);

addLabelFinder(
  plugins.mongodb,
  snapshot => 'MongoDB @' + snapshot.getIn(['data', 'port'])
);

addIconToRegistry({
  id: plugins.mongodb,
  image: iconPath
});

addSearchableEntityType('mongo', plugins.mongodb);
addSearchableEntityType('mongodb', plugins.mongodb);
