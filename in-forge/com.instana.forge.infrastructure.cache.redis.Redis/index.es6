'use strict';

import {
  addIconFinder
} from 'in-sdk/snapshot';
import * as pluginName from 'in-sdk/pluginName';
import * as zones from 'in-sdk/zones';

import * as constants from '../constants';
import iconPath from './icon.svg';

pluginName.setHumanReadablePluginName(
  constants.plugins.redis,
  'Redis Node',
  'Redis Nodes'
);

addIconFinder(
  constants.plugins.redis,
  () => iconPath
);

zones.addMapping(
  constants.plugins.redis,
  snapshot => snapshot.get('hostId')
);
