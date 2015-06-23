'use strict';

import * as ro from 'reactive-observables';

const reemitSpec = {emitLatestOnSubscribe: true};

// an array of metric names to visualize
export const activeMetrics = ro.create(reemitSpec);
activeMetrics.emit([]);
