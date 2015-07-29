'use strict';

import {
  addIconFinder
} from 'in-sdk/snapshot';
import * as pluginName from 'in-sdk/pluginName';

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
