import metricDefinitions from 'in-forge/plugins/sparkApplication/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/sparkApplication/kpiDefinitions';
import iconSvgPath from 'in-forge/plugins/sparkApplication/iconPath';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.sparkApplication,
  pluginName: {
    singular: 'Spark Application',
    plural: 'Spark Applications'
  },
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions
});
