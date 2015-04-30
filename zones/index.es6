'use strict';

import {addMapping} from 'instana-ui-sdk/zones';

addMapping(
  'com.instana.forge.infrastructure.os.OS',
  snapshot => {
    return snapshot.getIn([
      'snapshot',
      'com.instana.forge.infrastructure.virtualization.EC2',
      'snapshot',
      'availability-zone'
    ], 'undefined');
  }
);
