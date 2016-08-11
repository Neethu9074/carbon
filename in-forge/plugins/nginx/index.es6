import {addIconToRegistry} from 'in-sdk/iconRegistry';
import {addSearchableEntityType} from 'in-sdk/search';
import * as pluginName from 'in-sdk/pluginName';
import {addLabelFinder} from 'in-sdk/snapshot';
import * as sorting from 'in-sdk/sorting';
import * as power from 'in-sdk/power';

import * as constants from 'in-forge/constants';
import iconPath from 'in-forge/plugins/nginx/icon.svg';

pluginName.setHumanReadablePluginName(
  constants.plugins.nginx,
  'Nginx',
  'Nginx'
);

addLabelFinder(constants.plugins.nginx, getLabel);

power.addMapping(
  constants.plugins.nginx,
  () => -1
);

sorting.addMapping(
  constants.plugins.nginx,
  (s1, s2) => getLabel(s1).localeCompare(getLabel(s2))
);

function getLabel() {
  return 'Nginx';
}

addIconToRegistry({
  id: constants.plugins.nginx,
  image: iconPath
});

addSearchableEntityType('nginx', constants.plugins.nginx);
