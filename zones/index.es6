/* eslint-disable no-console, no-undef */

'use strict';

import Immutable from 'immutable';
import {addMapping} from 'instana-ui-sdk/zones';
import * as constants from '../constants';

addMapping(
  constants.plugins.os,
  snapshot => {
    let steadyIdToZone = snapshot.getIn([
      'data',
      constants.rels.describes,
      constants.plugins.ec2
    ], Immutable.Map());
    let zone = steadyIdToZone.valueSeq().first();
    return zone ? zone.get('availability-zone') : 'undefined';
  }
);

addMapping(
  constants.plugins.process,
  snapshot => snapshot.get('hostId')
);
