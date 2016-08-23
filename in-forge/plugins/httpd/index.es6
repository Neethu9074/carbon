import iconPath from 'in-forge/plugins/httpd/icon.svg';
import {addIconToRegistry} from 'in-sdk/iconRegistry';
import {addSearchableEntityType} from 'in-sdk/search';
import * as pluginName from 'in-sdk/pluginName';
import * as constants from 'in-forge/constants';
import {addLabelFinder} from 'in-sdk/snapshot';

pluginName.setHumanReadablePluginName(
  constants.plugins.httpd,
  'Apache Httpd',
  'Apache Httpds'
);

addLabelFinder(constants.plugins.httpd, getLabel);

function getLabel(snapshot) {
  return snapshot.getIn(['data', 'version']);
}

addIconToRegistry({
  id: constants.plugins.httpd,
  image: iconPath
});

addSearchableEntityType('httpd', constants.plugins.httpd);
addSearchableEntityType('apache', constants.plugins.httpd);
