'use strict';

import * as ro from 'reactive-observables';

const reemitSpec = {emitLatestOnSubscribe: true};

// value in milliseconds
export const timeframe = ro.create(reemitSpec);
timeframe.emit(1000 * 60 * 10);
