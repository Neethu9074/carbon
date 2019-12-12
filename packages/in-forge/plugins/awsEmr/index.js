import metricDefinitions from 'in-forge/plugins/awsEmr/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/awsEmr/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import iconSvgPath from 'in-forge/plugins/awsEmr/iconPath';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.awsEmr,
  pluginName: {
    singular: 'AWS EMR',
    plural: 'AWS EMRs'
  },
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions
});
