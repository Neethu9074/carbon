import {addIconToRegistry} from 'in-sdk/iconRegistry';
import {addSearchableEntityType} from 'in-sdk/search';
import * as pluginName from 'in-sdk/pluginName';
import {addLabelFinder} from 'in-sdk/snapshot';
import * as sorting from 'in-sdk/sorting';

import iconPath from 'in-forge/plugins/docker/icon.svg';
import * as constants from 'in-forge/constants';

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

sorting.addMapping(
  constants.plugins.docker,
  (s1, s2) => s1.get('hostId') > s2.get('hostId')
);

addIconToRegistry({
  id: constants.plugins.docker,
  image: iconPath
});

addSearchableEntityType('docker', constants.plugins.docker);
