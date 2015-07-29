'use strict';

import {
  addIconFinder
} from 'in-sdk/snapshot';
import * as pluginName from 'in-sdk/pluginName';

import * as constants from '../constants';
import iconPath from './icon.svg';

pluginName.setHumanReadablePluginName(
  constants.plugins.elasticsearch,
  'Elasticsearch Node',
  'Elasticsearch Nodes'
);

addIconFinder(
  constants.plugins.elasticsearch,
  () => iconPath
);
