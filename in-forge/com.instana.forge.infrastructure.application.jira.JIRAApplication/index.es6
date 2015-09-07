import * as pluginName from 'in-sdk/pluginName';
import {addIconFinder} from 'in-sdk/snapshot';
import * as zones from 'in-sdk/zones';

import * as constants from '../constants';
import iconPath from './icon.svg';

pluginName.setHumanReadablePluginName(
  constants.plugins.jira,
  'Atlassian JIRA',
  'Atlassian JIRAs'
);

addIconFinder(
  constants.plugins.jira,
  () => iconPath
);

zones.addMapping(
  constants.plugins.jira,
  snapshot => snapshot.get('hostId')
);
