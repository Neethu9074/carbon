import { addMaxValueLocator, addMinValueLocator } from 'in-sdk/metrics';

addMaxValueLocator(/^duration/, snapshot => snapshot.getIn(['data', 'duration']));
addMaxValueLocator(/^status/, () => 1);
addMinValueLocator(/^(duration|status)/, () => 0);
