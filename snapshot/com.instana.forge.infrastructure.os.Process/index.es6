'use strict';

import {
  addLabelFinder
} from 'instana-ui-sdk/snapshot';

import * as constants from '../../constants';

addLabelFinder(
  constants.plugins.process,
  snapshot => snapshot.getIn(['data', 'exec'])
);
