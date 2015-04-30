'use strict';

import {addMapping} from 'instana-ui-sdk/zones';

addMapping(
  'com.instana.forge.infrastructure.os.OS',
  snapshot => {
    const data = snapshot.get('snapshot');
    data.x = 1;
    return undefined;
  }
);
