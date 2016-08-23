import {addIconToRegistry} from 'in-sdk/iconRegistry';
import {addSearchableEntityType} from 'in-sdk/search';
import * as pluginName from 'in-sdk/pluginName';
import {addLabelFinder} from 'in-sdk/snapshot';

import * as constants from 'in-forge/constants';
import iconPath from 'in-forge/plugins/nginx/icon.svg';

pluginName.setHumanReadablePluginName(
  constants.plugins.nginx,
  'Nginx',
  'Nginx'
);

addLabelFinder(constants.plugins.nginx, getLabel);

function getLabel() {
  return 'Nginx';
}

addIconToRegistry({
  id: constants.plugins.nginx,
  image: iconPath
});

addSearchableEntityType('nginx', constants.plugins.nginx);
