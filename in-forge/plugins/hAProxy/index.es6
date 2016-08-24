import {addLabelFinder, registerSnapshotDefinition} from 'in-sdk/snapshot';
import {addSearchableEntityType} from 'in-sdk/search';
import {plugins} from 'in-forge/constants';
import {setHumanReadablePluginName} from 'in-sdk/pluginName';

import icon from './icon.svg';

registerSnapshotDefinition({
  plugin: plugins.haproxy,
  icon
});

setHumanReadablePluginName(
  plugins.haproxy,
  'HAProxy',
  'HAProxy'
);

addLabelFinder(
  plugins.haproxy,
    snapshot => {
    const pid = snapshot.getIn(['data', 'pid']);
    return 'HAProxy @' + pid;
  }
);

addSearchableEntityType('haproxy', plugins.haproxy);
