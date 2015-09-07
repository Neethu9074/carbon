import * as pluginName from 'in-sdk/pluginName';
import {addIconFinder} from 'in-sdk/snapshot';
import * as zones from 'in-sdk/zones';

import * as constants from '../constants';
import iconPath from './icon.svg';

pluginName.setHumanReadablePluginName(
  constants.plugins.tomcat,
  'Tomcat Server',
  'Tomcat Servers'
);

addIconFinder(
  constants.plugins.tomcat,
  () => iconPath
);

zones.addMapping(
  constants.plugins.tomcat,
  snapshot => snapshot.get('hostId')
);
