import {addLabelFinder, registerSnapshotDefinition} from 'in-sdk/snapshot';
import {addSearchableEntityType} from 'in-sdk/search';
import {setHumanReadablePluginName} from 'in-sdk/pluginName';
import {plugins} from 'in-forge/constants';

import icon from './icon.svg';

registerSnapshotDefinition({
  plugin: plugins.docker,
  icon
});

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

addSearchableEntityType('docker', plugins.docker);
