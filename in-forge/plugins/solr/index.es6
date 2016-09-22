import {addLabelFinder, registerSnapshotDefinition} from 'in-sdk/snapshot';
import {supportsCodeView, getCodeView} from 'in-forge/codeView/java';
import {setHumanReadablePluginName} from 'in-sdk/pluginName';
import icon from 'in-forge/plugins/solr/icon.svg';
import {addSearchableEntityType} from 'in-sdk/search';
import {plugins} from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.solr,
  icon,
  supportsCodeView,
  getCodeView
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

addSearchableEntityType('solr', plugins.solr);
