import metricDefinitions from 'in-forge/plugins/googleCloudSQL/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/googleCloudSQL/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.googleCloudSQL,
  pluginName: {
    singular: 'GCP SQL Instance',
    plural: 'GCP SQL Instances'
  },
  kpiDefinitions,
  metricDefinitions,

  getLabel(snapshot) {
    return snapshot.getIn(['data', 'name'], '');
  }
});
