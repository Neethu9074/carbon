import {addIconToRegistry} from 'in-sdk/iconRegistry';
import * as pluginName from 'in-sdk/pluginName';
import {addLabelFinder} from 'in-sdk/snapshot';
import * as power from 'in-sdk/power';

import iconPath from 'in-forge/plugins/dropwizardApplicationContainer/icon.svg';
import * as constants from 'in-forge/constants';

pluginName.setHumanReadablePluginName(
  constants.plugins.dropwizard,
  'Dropwizard',
  'Dropwizard'
);

addLabelFinder(
  constants.plugins.dropwizard,
  snapshot => snapshot.getIn(['data', 'name'], '')
);

power.addMapping(
  constants.plugins.dropwizard,
  () => -1
);

addIconToRegistry({
  id: constants.plugins.dropwizard,
  image: iconPath
});
