'use strict';

import {
  addIconFinder,
  addLabelFinder
} from 'in-sdk/snapshot';
import * as pluginName from 'in-sdk/pluginName';
import * as zones from 'in-sdk/zones';

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

zones.addMapping(
  constants.plugins.docker,
  snapshot => snapshot.get('hostId')
);
