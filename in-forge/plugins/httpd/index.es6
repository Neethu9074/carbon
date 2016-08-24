import iconPath from 'in-forge/plugins/httpd/icon.svg';
import {addIconToRegistry} from 'in-sdk/iconRegistry';
import {addSearchableEntityType} from 'in-sdk/search';
import {setHumanReadablePluginName} from 'in-sdk/pluginName';
import {plugins} from 'in-forge/constants';
import {addLabelFinder} from 'in-sdk/snapshot';

setHumanReadablePluginName(
  plugins.httpd,
  'Apache Httpd',
  'Apache Httpds'
);

addLabelFinder(plugins.httpd, getLabel);

function getLabel(snapshot) {
  return snapshot.getIn(['data', 'version']);
}

addIconToRegistry({
  id: plugins.httpd,
  image: iconPath
});

addSearchableEntityType('httpd', plugins.httpd);
addSearchableEntityType('apache', plugins.httpd);
