'use strict';

import {addMapping} from 'instana-ui-sdk/zones';
import * as constants from '../constants';

addMapping(
  constants.plugins.os,
  snapshot => {
    return snapshot.getIn([
      'snapshot',
      constants.rels.describes + ':' + constants.plugins.ec2,
      'availability-zone'
    ], 'undefined');
  }
);
