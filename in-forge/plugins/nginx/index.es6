import {addLabelFinder, registerSnapshotDefinition} from 'in-sdk/snapshot';
import {setHumanReadablePluginName} from 'in-sdk/pluginName';
import {addSearchableEntityType} from 'in-sdk/search';
import {plugins} from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import icon from './icon.svg';


registerSnapshotDefinition({
  plugin: plugins.nginx,
  icon,
  metricDefinitions
});

setHumanReadablePluginName(
  plugins.nginx,
  'Nginx',
  'Nginx'
);

addLabelFinder(plugins.nginx, getLabel);

function getLabel() {
  return 'Nginx';
}

addSearchableEntityType('nginx', plugins.nginx);
