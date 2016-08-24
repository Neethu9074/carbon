import {addLabelFinder, registerSnapshotDefinition} from 'in-sdk/snapshot';
import {addSearchableEntityType} from 'in-sdk/search';
import {setHumanReadablePluginName} from 'in-sdk/pluginName';
import {plugins} from 'in-forge/constants';

import icon from './icon.svg';

registerSnapshotDefinition({
  plugin: plugins.jira,
  icon
});

setHumanReadablePluginName(
  plugins.jira,
  'Atlassian JIRA',
  'Atlassian JIRAs'
);

addLabelFinder(
  plugins.jira,
  snapshot => 'Atlassian JIRA ' + snapshot.getIn(['data', 'version'])
);

addSearchableEntityType('jira', plugins.jira);
