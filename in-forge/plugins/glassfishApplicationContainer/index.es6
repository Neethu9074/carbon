import {addLabelFinder, registerSnapshotDefinition} from 'in-sdk/snapshot';
import {setHumanReadablePluginName} from 'in-sdk/pluginName';
import iconPath from 'in-forge/plugins/glassfishApplicationContainer/icon.svg';
import {addIconToRegistry} from 'in-sdk/iconRegistry';
import {addSearchableEntityType} from 'in-sdk/search';
import {plugins} from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.glassfish
});

setHumanReadablePluginName(
  plugins.glassfish,
  'Glassfish',
  'Glassfish'
);

addLabelFinder(plugins.glassfish, getLabel);

function getLabel(snapshot) {
  return 'Glassfish ' + snapshot.getIn(['data', 'version']);
}

addIconToRegistry({
  id: plugins.glassfish,
  image: iconPath
});


addSearchableEntityType('glassfish', plugins.glassfish);
