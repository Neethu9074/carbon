import {addLabelFinder, registerSnapshotDefinition} from 'in-sdk/snapshot';
import {setHumanReadablePluginName} from 'in-sdk/pluginName';
import {plugins} from 'in-forge/constants';

import icon from './icon.svg';

registerSnapshotDefinition({
  plugin: plugins.genericZone,
  icon
});

setHumanReadablePluginName(
  plugins.genericZone,
  'Generic Zone',
  'Generic Zones'
);

addLabelFinder(
  plugins.genericZone,
  s => s.getIn(['data', 'groupId'])
);
