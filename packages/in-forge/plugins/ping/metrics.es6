import { addMaxValueLocator, addMinValueLocator } from 'in-sdk/metrics';

addMaxValueLocator(/^duration/, snapshot => snapshot.getIn(['data', 'duration']));
addMinValueLocator(/^duration/, () => 0);
