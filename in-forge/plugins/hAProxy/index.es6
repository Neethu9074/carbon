import {addLabelFinder, registerSnapshotDefinition} from 'in-sdk/snapshot';
import {setHumanReadablePluginName} from 'in-sdk/pluginName';
import {addSearchableEntityType} from 'in-sdk/search';
import {plugins} from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';



registerSnapshotDefinition({
  plugin: plugins.haproxy,

  iconSvgPath,
  metricDefinitions
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
