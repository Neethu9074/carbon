import {addIconToRegistry} from 'in-sdk/iconRegistry';
import * as pluginName from 'in-sdk/pluginName';
import * as power from 'in-sdk/power';

import * as constants from '../constants';
import iconPath from './icon.svg';

pluginName.setHumanReadablePluginName(
  constants.plugins.elasticsearch,
  'Elasticsearch Node',
  'Elasticsearch Nodes'
);

power.addMapping(
  constants.plugins.elasticsearch,
  () => -1
);

addIconToRegistry({
  id: constants.plugins.elasticsearch,
  image: iconPath
});
