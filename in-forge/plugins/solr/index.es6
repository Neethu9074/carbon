import iconPath from 'in-forge/plugins/solr/icon.svg';
import {addIconToRegistry} from 'in-sdk/iconRegistry';
import {addSearchableEntityType} from 'in-sdk/search';
import {setHumanReadablePluginName} from 'in-sdk/pluginName';
import {addLabelFinder} from 'in-sdk/snapshot';
import {plugins} from 'in-forge/constants';

setHumanReadablePluginName(
  plugins.solr,
  'Solr',
  'Solr'
);

addLabelFinder(plugins.solr, getLabel);

function getLabel(snapshot) {
  return 'Solr ' + snapshot.getIn(['data', 'version']);
}

addIconToRegistry({
  id: plugins.solr,
  image: iconPath
});


addSearchableEntityType('solr', plugins.solr);
