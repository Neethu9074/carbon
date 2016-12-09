import {percentageZeroDecimalPlaces, bytesTwoDecimalPlaces} from 'in-services/formatters/number';
import {
  addMaxValueLocator,
  addMinValueLocator,
  addFormattedValueLocator
} from 'in-sdk/metrics';

const zero = () => 0;

addMaxValueLocator(
  /^memory\.free/,
  snapshot => snapshot.getIn(['data', 'memory.total'])
);
addMaxValueLocator(
  /^memory\.used/,
  () => 1
);
addMinValueLocator(/^memory\.(free|used)/, zero);

addMaxValueLocator(
  /^load/,
  snapshot => snapshot.getIn(['data', 'cpu.count'])
);
addMinValueLocator(/^load/, zero);

addMaxValueLocator(
  /^cpu\.(user|sys|wait|nice|steal|idle)/,
  () => 1
);
addMinValueLocator(/^cpu\.(user|sys|wait|nice|steal|idle)/, zero);

addMaxValueLocator(
  /^fs\.(.*)\.free/,
  (snapshot, matches) => snapshot.getIn([
    'data', 'filesystems', matches[1], 'capacity'
  ])
);
addMinValueLocator(/^fs\.(.*)\.free/, zero);

addMaxValueLocator(
  /^fs\.(.*)\.ifree/,
  (snapshot, matches) => snapshot.getIn([
    'data', 'filesystems', matches[1], 'icapacity'
  ])
);
addMinValueLocator(/^fs\.(.*)\.ifree/, zero);

addFormattedValueLocator(
  /^memory\.free/,
   // translates free -> used -> whateverBytes
  (max, value) => bytesTwoDecimalPlaces((max - value))
);
addFormattedValueLocator(
  /^memory\.used/,
  (max, value) => percentageZeroDecimalPlaces(value)
);

addFormattedValueLocator(
  /^load/,

  // 0.01 => 0.01, 0.01001 => 0.01
  (max, value) => (((value) * 100) | 0) / 100
);

addFormattedValueLocator(
  /^cpu\.(user|sys|wait|nice|steal|idle)/,
  (max, value) => (((value * 10000) | 0) / 100) + '%' // 0.301 => 30%
);
