import { addLabelFinder, registerSnapshotDefinition } from 'in-sdk/snapshot';
import { supportsCodeView, getCodeView } from 'in-forge/codeView/java';
import { setHumanReadablePluginName } from 'in-sdk/pluginName';
import { addSearchableEntityType } from 'in-sdk/search';
import { plugins } from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.jira,

  iconSvgPath,
  metricDefinitions,
  supportsCodeView,
  getCodeView
});

setHumanReadablePluginName(plugins.jira, 'Atlassian JIRA', 'Atlassian JIRAs');

addLabelFinder(plugins.jira, snapshot => 'Atlassian JIRA ' + snapshot.getIn(['data', 'version']));

addSearchableEntityType('jira', plugins.jira);
