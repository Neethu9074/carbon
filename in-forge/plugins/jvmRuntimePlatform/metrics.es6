import { addMaxValueLocator, addMinValueLocator } from 'in-sdk/metrics';

const zero = () => 0;

addMaxValueLocator(/^pools\.([^\.]+)/, (snapshot, matches) =>
  snapshot.getIn(['data', 'jvm', 'pools', matches[1], 'max'])
);
addMinValueLocator(/^pools\.([^\.]+)/, zero);
