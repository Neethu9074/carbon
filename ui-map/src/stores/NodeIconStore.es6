'use strict';

import * as ro from 'reactive-observables';

const roSpec = {emitLatestOnSubscribe: true};
export const iconSizeStore = ro.create(roSpec);
