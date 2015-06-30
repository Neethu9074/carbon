'use strict';

import * as ro from 'reactive-observables';

const reemitSpec = {emitLatestOnSubscribe: true};

export const zoomLevel = ro.create(reemitSpec);

// zoomLevel.emit(0.5);
//0 -> 0% = nearest zoom, 1 -> 100% = 100% zommout, 2 -> 200%, ...
