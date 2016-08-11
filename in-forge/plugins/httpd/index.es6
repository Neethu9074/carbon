import iconPath from 'in-forge/plugins/httpd/icon.svg';
import {addIconToRegistry} from 'in-sdk/iconRegistry';
import {addSearchableEntityType} from 'in-sdk/search';
import * as pluginName from 'in-sdk/pluginName';
import * as constants from 'in-forge/constants';
import {addLabelFinder} from 'in-sdk/snapshot';
import * as sorting from 'in-sdk/sorting';
import * as power from 'in-sdk/power';


pluginName.setHumanReadablePluginName(
  constants.plugins.httpd,
  'Apache Httpd',
  'Apache Httpds'
);

addLabelFinder(constants.plugins.httpd, getLabel);

power.addMapping(
  constants.plugins.httpd,
  () => -1
);

sorting.addMapping(
  constants.plugins.httpd,
  (s1, s2) => getLabel(s1).localeCompare(getLabel(s2))
);

function getLabel(snapshot) {
  return snapshot.getIn(['data', 'version']);
}

addIconToRegistry({
  id: constants.plugins.httpd,
  image: iconPath
});

addSearchableEntityType('httpd', constants.plugins.httpd);
addSearchableEntityType('apache', constants.plugins.httpd);
