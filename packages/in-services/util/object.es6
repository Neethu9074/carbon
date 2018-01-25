// @flow

import deepFreezeStrict from 'deep-freeze-strict';

// reexporting because I am not sure whether deep-freeze-strict is a good choice.
export const deepFreeze = <T>(v: T): T => deepFreezeStrict(v);
