'use strict';

import {addMaxValueLocator} from 'instana-ui-sdk/metrics';

addMaxValueLocator(
  /^memory\.free/,
  snapshot => snapshot.getIn(['data', 'memory.total'])
);

addMaxValueLocator(
  /^load/,
  snapshot => snapshot.getIn(['data', 'cpu.count'])
);

addMaxValueLocator(
  /^cpu\.(user|system|io|nice|steal|idle)/,
  () => 1
);
