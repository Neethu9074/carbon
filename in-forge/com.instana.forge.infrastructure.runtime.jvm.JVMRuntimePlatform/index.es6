'use strict';

import {
  addLabelFinder,
  addIconFinder
} from 'in-sdk/snapshot';
import * as pluginName from 'in-sdk/pluginName';

import * as constants from '../constants';
import iconPath from './icon.svg';

import './metrics.es6';

pluginName.setHumanReadablePluginName(
  constants.plugins.jvm,
  'JVM',
  'JVMs'
);

addLabelFinder(
  constants.plugins.jvm,
  snapshot => snapshot.get('steadyId')
);

addIconFinder(
  constants.plugins.jvm,
  () => iconPath
);
