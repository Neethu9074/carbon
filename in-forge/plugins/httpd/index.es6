import {addLabelFinder, registerSnapshotDefinition} from 'in-sdk/snapshot';
import {setHumanReadablePluginName} from 'in-sdk/pluginName';
import {addSearchableEntityType} from 'in-sdk/search';
import {plugins} from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import icon from './icon.svg';


registerSnapshotDefinition({
  plugin: plugins.httpd,
  icon,
  metricDefinitions
});

setHumanReadablePluginName(
  plugins.httpd,
  'Apache Httpd',
  'Apache Httpds'
);

addLabelFinder(plugins.httpd, getLabel);

function getLabel(snapshot) {
  return snapshot.getIn(['data', 'version']);
}

addSearchableEntityType('httpd', plugins.httpd);
addSearchableEntityType('apache', plugins.httpd);
