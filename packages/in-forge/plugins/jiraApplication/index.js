import metricDefinitions from 'in-forge/plugins/jiraApplication/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/jiraApplication/kpiDefinitions';
import { supportsCodeView, getCodeView } from 'in-forge/codeView/java';
import iconSvgPath from 'in-forge/plugins/jiraApplication/iconPath';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.jiraApplication,
  pluginName: {
    singular: 'Atlassian JIRA',
    plural: 'Atlassian JIRAs'
  },
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions,
  getCodeView,
  supportsCodeView
});
