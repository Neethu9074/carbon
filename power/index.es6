'use strict';

import {addMapping} from 'instana-ui-sdk/power';
import * as constants from '../constants';

addMapping(
  constants.plugins.os,
  snapshot => {
    const data = snapshot.get('snapshot');
    return data.get('memory.total', 1) * data.get('cpu.count', 1);
  }
);
