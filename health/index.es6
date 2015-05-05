'use strict';

import {health, addMapping} from 'instana-ui-sdk/health';
import * as constants from '../constants';

addMapping(
  constants.plugins.os,
  snapshot => {
    const score = snapshot.getIn(['snapshot', 'accumulated.status', 'score']);

    if (score === null || score === undefined) {
      return health.ok;
    } else if (score < 0.5) {
      return health.danger;
    } else if (score < 0.95) {
      return health.warning;
    }

    return health.ok;
  }
);
