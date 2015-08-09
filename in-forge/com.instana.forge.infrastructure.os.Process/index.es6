

import * as ro from 'reactive-observables';

import {
  addLabelFinder,
  addIconFinder,
  addWiredSnapshotFinder
} from 'in-sdk/snapshot';
import * as pluginName from 'in-sdk/pluginName';
import * as zones from 'in-sdk/zones';

import iconPath from './icon.svg';
import * as constants from '../constants';

pluginName.setHumanReadablePluginName(
  constants.plugins.process,
  'Process',
  'Processes'
);

addLabelFinder(
  constants.plugins.process,
  snapshot => snapshot.getIn(['data', 'exec'])
);

addIconFinder(
  constants.plugins.process,
  () => iconPath
);

addWiredSnapshotFinder(constants.plugins.process, () => ro.create());

zones.addMapping(
  constants.plugins.process,
  snapshot => snapshot.get('hostId')
);
