

import {
  addIconFinder
} from 'in-sdk/snapshot';
import * as pluginName from 'in-sdk/pluginName';
import * as zones from 'in-sdk/zones';

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

zones.addMapping(
  constants.plugins.cassandra,
  snapshot => snapshot.get('hostId')
);
