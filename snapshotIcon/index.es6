'use strict';

import {addIconFinder} from 'instana-ui-sdk/snapshotIcon';
import * as constants from '../constants';

addIconFinder(
  constants.plugins.os,
  snapshot => {
    const os = snapshot.getIn(['data', 'os.name']);
    if (os.match(/linux/i)) {
      return 'linux';
    } else if (os.match(/windows/i)) {
      return 'windows';
    } else if (os.match(/mac/i)) {
      return 'apple';
    }

    return 'server';
  }
);
