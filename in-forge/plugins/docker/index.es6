import {addIconToRegistry} from 'in-sdk/iconRegistry';
import {addSearchableEntityType} from 'in-sdk/search';
import {setHumanReadablePluginName} from 'in-sdk/pluginName';
import {addLabelFinder} from 'in-sdk/snapshot';

import iconPath from 'in-forge/plugins/docker/icon.svg';
import {plugins} from 'in-forge/constants';

setHumanReadablePluginName(
  plugins.docker,
  'Docker Container',
  'Docker Containers'
);

addLabelFinder(
  plugins.docker,
  s => {
    const names = s.getIn(['data', 'Names']);
    if (names) {
      return names.join(', ');
    }
    return undefined;
  }
);

addIconToRegistry({
  id: plugins.docker,
  image: iconPath
});

addSearchableEntityType('docker', plugins.docker);
