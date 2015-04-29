'use strict';

import {addMapping} from 'instana-ui-sdk/power';

addMapping(
  'com.instana.forge.infrastructure.os.OS',
  snapshot => {
    const data = snapshot.get('snapshot');
    return data.get('memory.total', 1) * data.get('cpu.count', 1);
  }
);
