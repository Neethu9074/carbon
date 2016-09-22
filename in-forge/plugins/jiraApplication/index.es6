import {addLabelFinder, registerSnapshotDefinition} from 'in-sdk/snapshot';
import {supportsCodeView, getCodeView} from 'in-forge/codeView/java';
import {setHumanReadablePluginName} from 'in-sdk/pluginName';
import {addSearchableEntityType} from 'in-sdk/search';
import {plugins} from 'in-forge/constants';

import icon from './icon.svg';

registerSnapshotDefinition({
  plugin: plugins.jira,
  icon,
  supportsCodeView,
  getCodeView
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
