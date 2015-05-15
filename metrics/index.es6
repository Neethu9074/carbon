'use strict';

import {addMaxValueLocator} from 'instana-ui-sdk/metrics';

addMaxValueLocator(
  /^memory\.free/,
  snapshot => snapshot.getIn(['snapshot', 'memory.total'])
);

addMaxValueLocator(
  /^load/,
  snapshot => snapshot.getIn(['snapshot', 'cpu.count'])
);

addMaxValueLocator(
  /^cpu\.(user|system|io|nice|steal|idle)/,
  () => 100
);
