import {addLabelFinder, registerSnapshotDefinition} from 'in-sdk/snapshot';
import {addSearchableEntityType} from 'in-sdk/search';
import {setHumanReadablePluginName} from 'in-sdk/pluginName';
import {plugins} from 'in-forge/constants';

import icon from './icon.svg';

registerSnapshotDefinition({
  plugin: plugins.httpd,
  icon
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
