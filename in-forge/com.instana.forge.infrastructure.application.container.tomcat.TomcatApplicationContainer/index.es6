import {
  addLabelFinder,
  addIconFinder
} from 'in-sdk/snapshot';
import * as pluginName from 'in-sdk/pluginName';
import * as zones from 'in-sdk/zones';
import * as power from 'in-sdk/power';

import * as constants from '../constants';
import iconPath from './icon.svg';

pluginName.setHumanReadablePluginName(
  constants.plugins.tomcat,
  'Tomcat Server',
  'Tomcat Servers'
);

addLabelFinder(
  constants.plugins.tomcat,
  snapshot => snapshot.getIn(['data', 'version'])
);

addIconFinder(
  constants.plugins.tomcat,
  () => iconPath
);

zones.addMapping(
  constants.plugins.tomcat,
  snapshot => snapshot.get('hostId')
);

power.addMapping(
  constants.plugins.tomcat,
  () => 1
);
