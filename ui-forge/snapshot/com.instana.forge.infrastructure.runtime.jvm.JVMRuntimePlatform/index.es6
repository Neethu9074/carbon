'use strict';

import {
  addLabelFinder
} from 'instana-ui-sdk/snapshot';

import * as constants from '../../constants';

addLabelFinder(
  constants.plugins.jvm,
  snapshot => snapshot.get('steadyId')
);
