import {addLabelFinder, registerSnapshotDefinition} from 'in-sdk/snapshot';
import {setHumanReadablePluginName} from 'in-sdk/pluginName';
import {addSearchableEntityType} from 'in-sdk/search';
import {plugins} from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import icon from './icon.svg';


registerSnapshotDefinition({
  plugin: plugins.clrRuntimePlatform,
  icon,
  metricDefinitions
});

setHumanReadablePluginName(
  plugins.clrRuntimePlatform,
  '.NET Application',
  '.NET Applications'
);

addLabelFinder(
  plugins.clrRuntimePlatform,
  snapshot => '.NET-App ' + snapshot.getIn(['data', 'name'])
);

addSearchableEntityType('clr', plugins.clrRuntimePlatform);
