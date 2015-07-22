'use strict';

import * as ro from 'reactive-observables';

import * as pluginName from 'instana-ui-sdk/pluginName';
import * as zones from 'instana-ui-sdk/zones';

import {
  addLabelFinder,
  addWiredSnapshotFinder
} from 'instana-ui-sdk/snapshot';

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

addWiredSnapshotFinder(constants.plugins.process, () => ro.create());

zones.addMapping(
  constants.plugins.process,
  snapshot => snapshot.get('hostId')
);
