'use strict';

import {
  addIconFinder,
  addLabelFinder
} from 'instana-ui-sdk/snapshot';
import * as pluginName from 'instana-ui-sdk/pluginName';

import iconPath from './icon.svg';
import * as constants from '../constants';

pluginName.setHumanReadablePluginName(
  constants.plugins.docker,
  'Docker Container',
  'Docker Container'
);

addLabelFinder(
  constants.plugins.docker,
  s => s.getIn(['data', 'Names'])
);

addIconFinder(
  constants.plugins.docker,
  () => iconPath
);
