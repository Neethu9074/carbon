import iconPath from 'in-forge/plugins/msiis/icon.svg';
import {addIconToRegistry} from 'in-sdk/iconRegistry';
import {setHumanReadablePluginName} from 'in-sdk/pluginName';
import {plugins} from 'in-forge/constants';
import {addSearchableEntityType} from 'in-sdk/search';
import {addLabelFinder} from 'in-sdk/snapshot';

setHumanReadablePluginName(
  plugins.msiis,
  'Internet Information Server',
  'Internet Information Servers'
);

addLabelFinder(
  plugins.msiis,
  snapshot => 'IIS ' + snapshot.getIn(['data', 'iis.version'])
);

addIconToRegistry({
  id: plugins.msiis,
  image: iconPath
});

addSearchableEntityType('msiis', plugins.msiis);
addSearchableEntityType('iis', plugins.msiis);
