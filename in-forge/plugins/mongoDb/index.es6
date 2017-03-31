import { addLabelFinder, registerSnapshotDefinition } from 'in-sdk/snapshot';
import { setHumanReadablePluginName } from 'in-sdk/pluginName';
import { addSearchableEntityType } from 'in-sdk/search';
import { plugins } from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.mongodb,

  iconSvgPath,
  metricDefinitions
});

setHumanReadablePluginName(plugins.mongodb, 'MongoDB Node', 'MongoDB Nodes');

addLabelFinder(plugins.mongodb, snapshot => 'MongoDB @' + snapshot.getIn(['data', 'port']));

addSearchableEntityType('mongo', plugins.mongodb);
addSearchableEntityType('mongodb', plugins.mongodb);
