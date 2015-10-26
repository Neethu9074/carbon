import {addIconFinder, addLabelFinder} from 'in-sdk/snapshot';
import * as pluginName from 'in-sdk/pluginName';
import * as sorting from 'in-sdk/sorting';
import * as zones from 'in-sdk/zones';
import * as power from 'in-sdk/power';

import iconPath from './icon.svg';
import * as constants from '../constants';

pluginName.setHumanReadablePluginName(
  constants.plugins.docker,
  'Docker Container',
  'Docker Containers'
);

addLabelFinder(
  constants.plugins.docker,
  s => {
    const names = s.getIn(['data', 'Names']);
    if (names) {
      return names.join(', ');
    }
    return undefined;
  }
);

addIconFinder(
  constants.plugins.docker,
  () => iconPath
);

zones.addMapping(
  constants.plugins.docker,
  snapshot => snapshot.get('hostId')
);

power.addMapping(
  constants.plugins.docker,
  () => -1
);

sorting.addMapping(
  constants.plugins.docker,
  (s1, s2) => s1.get('hostId') > s2.get('hostId')
);
