import {addLabelFinder, registerSnapshotDefinition} from 'in-sdk/snapshot';
import {setHumanReadablePluginName} from 'in-sdk/pluginName';
import {addSearchableEntityType} from 'in-sdk/search';
import {plugins} from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import icon from './icon.svg';


registerSnapshotDefinition({
  plugin: plugins.msiis,
  icon,
  metricDefinitions
});

setHumanReadablePluginName(
  plugins.msiis,
  'Internet Information Server',
  'Internet Information Servers'
);

addLabelFinder(
  plugins.msiis,
  snapshot => 'IIS ' + snapshot.getIn(['data', 'iis.version'])
);

addSearchableEntityType('msiis', plugins.msiis);
addSearchableEntityType('iis', plugins.msiis);
