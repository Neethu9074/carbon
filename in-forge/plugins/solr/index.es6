import {addLabelFinder, registerSnapshotDefinition} from 'in-sdk/snapshot';
import {setHumanReadablePluginName} from 'in-sdk/pluginName';
import iconPath from 'in-forge/plugins/solr/icon.svg';
import {addIconToRegistry} from 'in-sdk/iconRegistry';
import {addSearchableEntityType} from 'in-sdk/search';
import {plugins} from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.solr
});

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
