import { setHumanReadablePluginName } from 'in-sdk/pluginName';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { addSearchableEntityType } from 'in-sdk/search';
import { plugins } from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.jbossdatagrid,

  iconSvgPath,
  metricDefinitions
});

setHumanReadablePluginName(plugins.jbossdatagrid, 'Jboss Data Grid', 'Jboss Data Grids');

addSearchableEntityType('jdg', plugins.jbossdatagrid);
addSearchableEntityType('jbdg', plugins.jbossdatagrid);
