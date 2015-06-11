'use strict';

import {
  addMaxValueLocator,
  addMinValueLocator,
  addNormalizedValueLocator
} from 'instana-ui-sdk/metrics';

const zero = () => 0;

addMaxValueLocator(
  /^memory\.free/,
  snapshot => snapshot.getIn(['data', 'memory.total'])
);
addMinValueLocator(/^memory\.free/, zero);

addMaxValueLocator(
  /^load/,
  snapshot => snapshot.getIn(['data', 'cpu.count'])
);
addMinValueLocator(/^load/, zero);

addMaxValueLocator(
  /^cpu\.total\.(user|sys|wait|nice|steal|idle)/,
  () => 1
);
addMinValueLocator(/^cpu\.total\.(user|sys|wait|nice|steal|idle)/, zero);


addNormalizedValueLocator(
  /^memory\.free/,
  (max, value) => (max - value) / max //translates free -> used
);

addNormalizedValueLocator(
  /^load/,
  (max, value) => value / max
);

addNormalizedValueLocator(
  /^cpu\.total\.(user|sys|io|nice|steal|idle)/,
  (max, value) => value
);
