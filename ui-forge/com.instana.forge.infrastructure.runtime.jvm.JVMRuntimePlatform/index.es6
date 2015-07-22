'use strict';

import {
  addLabelFinder
} from 'instana-ui-sdk/snapshot';
import * as pluginName from 'instana-ui-sdk/pluginName';

import * as constants from '../constants';

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
