'use strict';

import {addIconFinder, addLabelFinder} from 'instana-ui-sdk/snapshot';
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

addLabelFinder(
  constants.plugins.os,
  snapshot => snapshot.getIn(['data', 'hostname'])
);
