'use strict';

import * as pluginName from 'instana-ui-sdk/pluginName';

import * as constants from '../constants';

pluginName.setHumanReadablePluginName(
  constants.plugins.docker,
  'Docker Container',
  'Docker Container'
);
