import {addLabelFinder, registerSnapshotDefinition} from 'in-sdk/snapshot';
import {setHumanReadablePluginName} from 'in-sdk/pluginName';
import {plugins} from 'in-forge/constants';
import {addSearchableEntityType} from 'in-sdk/search';

import icon from './icon.svg';

registerSnapshotDefinition({
  plugin: plugins.clrRuntimePlatform,
  icon
});

setHumanReadablePluginName(
  plugins.clrRuntimePlatform,
  '.NET Application',
  '.NET Applications'
);

addLabelFinder(
  plugins.clrRuntimePlatform,
  snapshot => snapshot.getIn(['data', 'name'])
);

addSearchableEntityType('clr', plugins.clrRuntimePlatform);
