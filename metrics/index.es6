'use strict';

import {addMaxValueLocator,
  addNormalizedValueLocator} from 'instana-ui-sdk/metrics';

addMaxValueLocator(
  /^memory\.free/,
  snapshot => snapshot.getIn(['data', 'memory.total'])
);

addMaxValueLocator(
  /^load/,
  snapshot => snapshot.getIn(['data', 'cpu.count'])
);

addMaxValueLocator(
  /^cpu\.total\.(user|system|io|nice|steal|idle)/,
  () => 1
);


addNormalizedValueLocator(
  /^memory\.free/,
  (max, value) => (max - value) / max //translates free -> used
);

addNormalizedValueLocator(
  /^load/,
  (max, value) => value / max
);

addNormalizedValueLocator(
  /^cpu\.total\.(user|system|io|nice|steal|idle)/,
  (max, value) => value
);
