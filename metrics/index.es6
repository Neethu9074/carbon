'use strict';

import {formatBytes} from 'instana-ui-services/converters';
import {
  addMaxValueLocator,
  addMinValueLocator,
  addNormalizedValueLocator,
  addFormattedValueLocator
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

addMaxValueLocator(
  /^fs\.([^\.]+)\.free/,
  (snapshot, matches) => snapshot.getIn([
    'data', 'filesystems', matches[1], 'capacity'
  ])
);
addMinValueLocator(/^fs\.([^\.]+)\.free/, zero);


addNormalizedValueLocator(
  /^memory\.free/,
  (max, value) => (max - value) / max //translates free -> used
);

addNormalizedValueLocator(
  /^load/,
  (max, value) => value / max
);

addNormalizedValueLocator(
  /^cpu\.total\.(user|sys|wait|nice|steal|idle)/,
  (max, value) => value
);


addFormattedValueLocator(
  /^memory\.free/,
  (value) => formatBytes(value) // bytes to whateverBytes
);

addFormattedValueLocator(
  /^load/,
  (value) => ((value * 100) | 0) / 100 // 0.01 => 0.01
);

addFormattedValueLocator(
  /^cpu\.total\.(user|sys|wait|nice|steal|idle)/,
  (value) => (((value * 10000) | 0) / 100) + '%' // 0.3 => 30%
);
