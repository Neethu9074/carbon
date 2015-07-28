'use strict';

import {
  addIconFinder
} from 'instana-ui-sdk/snapshot';
import * as pluginName from 'instana-ui-sdk/pluginName';

import * as constants from '../constants';
import iconPath from './icon.svg';

pluginName.setHumanReadablePluginName(
  constants.plugins.cassandra,
  'Cassandra Node',
  'Cassandra Nodes'
);

addIconFinder(
  constants.plugins.cassandra,
  () => iconPath
);
