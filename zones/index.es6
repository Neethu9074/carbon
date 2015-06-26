/* eslint-disable no-console, no-undef */

'use strict';

import {addMapping} from 'instana-ui-sdk/zones';
import * as constants from '../constants';

addMapping(
  constants.plugins.os,
  snapshot => {
    return snapshot.getIn([
      'data',
      constants.rels.describes,
      'localhost',
      'availability-zone'
    ], 'undefined');
  }
);

addMapping(
  constants.plugins.process,
  snapshot => snapshot.get('hostId')
);
