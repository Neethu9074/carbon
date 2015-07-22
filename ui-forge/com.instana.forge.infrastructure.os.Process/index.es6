'use strict';

import * as ro from 'reactive-observables';

import {
  // addIconFinder,
  addLabelFinder,
  addWiredSnapshotFinder
} from 'instana-ui-sdk/snapshot';

import * as constants from '../constants';

addLabelFinder(
  constants.plugins.process,
  snapshot => snapshot.getIn(['data', 'exec'])
);

addWiredSnapshotFinder(constants.plugins.process, () => ro.create());
