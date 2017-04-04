import { setHumanReadablePluginName } from 'in-sdk/pluginName';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { addSearchableEntityType } from 'in-sdk/search';
import { plugins } from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.msiis,

  iconSvgPath,
  metricDefinitions
});

setHumanReadablePluginName(plugins.msiis, 'Internet Information Server', 'Internet Information Servers');

addSearchableEntityType('msiis', plugins.msiis);
addSearchableEntityType('iis', plugins.msiis);
