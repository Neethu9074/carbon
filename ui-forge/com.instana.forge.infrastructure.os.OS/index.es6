'use strict';

import {
  addIconFinder,
  addLabelFinder
} from 'instana-ui-sdk/snapshot';

import * as constants from '../constants';

import './wiring';

import linuxIconPath from './icons/instana_server_linux.svg';
import windowsIconPath from './icons/instana_server_windows.svg';
import appleIconPath from './icons/instana_server_apple.svg';


addIconFinder(
  constants.plugins.os,
  snapshot => {
    const os = snapshot.getIn(['data', 'os.name']);
    if (os.match(/linux/i)) {
      return linuxIconPath;
    } else if (os.match(/windows/i)) {
      return windowsIconPath;
    } else if (os.match(/mac/i)) {
      return appleIconPath;
    }

    return undefined;
  }
);

addLabelFinder(
  constants.plugins.os,
  snapshot => snapshot.getIn(['data', 'hostname'])
);
