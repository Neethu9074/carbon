

import * as ro from 'reactive-observables';

const roSpec = {emitLatestOnSubscribe: true};

export const mapStatisticsStore = ro.create(roSpec);
