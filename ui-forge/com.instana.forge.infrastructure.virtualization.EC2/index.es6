'use strict';

import * as pluginName from 'instana-ui-sdk/pluginName';

import * as constants from '../constants';

pluginName.setHumanReadablePluginName(
  constants.plugins.ec2,
  'EC2 Instance',
  'EC2 Instances'
);
