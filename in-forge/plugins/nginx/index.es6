import { addLabelFinder, registerSnapshotDefinition } from 'in-sdk/snapshot';
import { setHumanReadablePluginName } from 'in-sdk/pluginName';
import { addSearchableEntityType } from 'in-sdk/search';
import { plugins } from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.nginx,

  iconSvgPath,
  metricDefinitions
});

setHumanReadablePluginName(plugins.nginx, 'Nginx', 'Nginx');

addLabelFinder(plugins.nginx, getLabel);

function getLabel() {
  return 'Nginx';
}

addSearchableEntityType('nginx', plugins.nginx);
