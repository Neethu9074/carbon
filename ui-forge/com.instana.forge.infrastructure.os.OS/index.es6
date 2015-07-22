'use strict';

import Immutable from 'immutable';

import {
  addIconFinder,
  addLabelFinder
} from 'instana-ui-sdk/snapshot';
import * as power from 'instana-ui-sdk/power';
import * as sorting from 'instana-ui-sdk/sorting';
import * as zones from 'instana-ui-sdk/zones';

import * as constants from '../constants';
import linuxIconPath from './icons/instana_server_linux.svg';
import windowsIconPath from './icons/instana_server_windows.svg';
import appleIconPath from './icons/instana_server_apple.svg';

import './metrics';
import './wiring';

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


power.addMapping(
  constants.plugins.os,
  snapshot => {
    const data = snapshot.get('data');
    return data.get('memory.total', 1) * data.get('cpu.count', 1);
  }
);

sorting.addMapping(
  constants.plugins.os,
  (s1, s2) => s1.get('hostId').localeCompare(s2.get('hostId'))
);

zones.addMapping(
  constants.plugins.os,
  snapshot => {
    let steadyIdToZone = snapshot.getIn([
      'data',
      constants.rels.describes,
      constants.plugins.ec2
    ], Immutable.Map());
    let zone = steadyIdToZone.valueSeq().first();
    return zone ? zone.get('availability-zone') : 'undefined';
  }
);
