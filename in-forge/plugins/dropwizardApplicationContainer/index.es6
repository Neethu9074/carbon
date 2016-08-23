import iconPath from 'in-forge/plugins/dropwizardApplicationContainer/icon.svg';
import {addIconToRegistry} from 'in-sdk/iconRegistry';
import * as pluginName from 'in-sdk/pluginName';
import {addSearchableEntityType} from 'in-sdk/search';
import * as constants from 'in-forge/constants';
import {addLabelFinder} from 'in-sdk/snapshot';


pluginName.setHumanReadablePluginName(
  constants.plugins.dropwizard,
  'Dropwizard',
  'Dropwizard'
);

addLabelFinder(
  constants.plugins.dropwizard,
  snapshot => snapshot.getIn(['data', 'name'], '')
);

addIconToRegistry({
  id: constants.plugins.dropwizard,
  image: iconPath
});


addSearchableEntityType('dropwizard', constants.plugins.dropwizard);
