'use strict';

import {
  addLabelFinder
} from 'instana-ui-sdk/snapshot';

import * as constants from '../constants';

import './metrics.es6';

addLabelFinder(
  constants.plugins.jvm,
  snapshot => snapshot.get('steadyId')
);
