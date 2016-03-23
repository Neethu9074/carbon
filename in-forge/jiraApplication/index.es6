import {addIconToRegistry} from 'in-sdk/iconRegistry';
import * as pluginName from 'in-sdk/pluginName';
import {addLabelFinder} from 'in-sdk/snapshot';
import * as power from 'in-sdk/power';

import * as constants from 'in-forge/constants';
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

power.addMapping(
  constants.plugins.jira,
  () => -1
);

addIconToRegistry({
  id: constants.plugins.jira,
  image: iconPath
});
