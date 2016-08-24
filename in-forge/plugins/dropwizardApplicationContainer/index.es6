import iconPath from 'in-forge/plugins/dropwizardApplicationContainer/icon.svg';
import {addIconToRegistry} from 'in-sdk/iconRegistry';
import {setHumanReadablePluginName} from 'in-sdk/pluginName';
import {addSearchableEntityType} from 'in-sdk/search';
import {plugins} from 'in-forge/constants';
import {addLabelFinder} from 'in-sdk/snapshot';


setHumanReadablePluginName(
  plugins.dropwizard,
  'Dropwizard',
  'Dropwizard'
);

addLabelFinder(
  plugins.dropwizard,
  snapshot => snapshot.getIn(['data', 'name'], '')
);

addIconToRegistry({
  id: plugins.dropwizard,
  image: iconPath
});


addSearchableEntityType('dropwizard', plugins.dropwizard);
