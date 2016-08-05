import iconPath from 'in-forge/plugins/solr/icon.svg';
import {addIconToRegistry} from 'in-sdk/iconRegistry';
import {addSearchableType} from 'in-sdk/search';
import * as pluginName from 'in-sdk/pluginName';
import {addLabelFinder} from 'in-sdk/snapshot';
import * as constants from 'in-forge/constants';
import * as power from 'in-sdk/power';

pluginName.setHumanReadablePluginName(
  constants.plugins.solr,
  'Solr',
  'Solr'
);

addLabelFinder(constants.plugins.solr, getLabel);

power.addMapping(
  constants.plugins.solr,
  () => -1
);

function getLabel(snapshot) {
  return 'Solr ' + snapshot.getIn(['data', 'version']);
}

addIconToRegistry({
  id: constants.plugins.solr,
  image: iconPath
});


addSearchableType('solr', constants.plugins.solr);
