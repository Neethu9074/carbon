import metricDefinitions from 'in-forge/plugins/jenkins/metricDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.jenkins,
  metricDefinitions,
  iconSvgPath,
  pluginName: {
    singular: 'Jenkins',
    plural: 'Jenkinses'
  }
});
