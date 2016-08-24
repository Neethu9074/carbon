import {addIconToRegistry} from 'in-sdk/iconRegistry';
import {addSearchableEntityType} from 'in-sdk/search';
import {setHumanReadablePluginName} from 'in-sdk/pluginName';
import {addLabelFinder} from 'in-sdk/snapshot';

import {plugins} from 'in-forge/constants';
import iconPath from 'in-forge/plugins/nginx/icon.svg';

setHumanReadablePluginName(
  plugins.nginx,
  'Nginx',
  'Nginx'
);

addLabelFinder(plugins.nginx, getLabel);

function getLabel() {
  return 'Nginx';
}

addIconToRegistry({
  id: plugins.nginx,
  image: iconPath
});

addSearchableEntityType('nginx', plugins.nginx);
