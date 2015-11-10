import {
  addLabelFinder,
  addIconFinder
} from 'in-sdk/snapshot';
import * as pluginName from 'in-sdk/pluginName';
import * as zones from 'in-sdk/zones';
import * as power from 'in-sdk/power';

import * as constants from '../constants';
import iconPath from './icon.svg';

pluginName.setHumanReadablePluginName(
  constants.plugins.jira,
  'Atlassian JIRA',
  'Atlassian JIRAs'
);

addLabelFinder(
  constants.plugins.jira,
  snapshot => 'Atlassian JIRA ' + snapshot.getIn(['data', 'version'])
);

addIconFinder(
  constants.plugins.jira,
  () => iconPath
);

zones.addMapping(
  constants.plugins.jira,
  snapshot => snapshot.get('hostId')
);

power.addMapping(
  constants.plugins.jira,
  () => -1
);
