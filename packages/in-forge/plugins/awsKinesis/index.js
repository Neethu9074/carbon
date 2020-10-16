import metricDefinitions from 'in-forge/plugins/awsKinesis/metricDefinitions';
import kpiDefinitions from 'in-forge/plugins/awsKinesis/kpiDefinitions';
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

registerSnapshotDefinition({
  plugin: plugins.awsKinesis,
  pluginName: {
    singular: 'AWS Kinesis stream',
    plural: 'AWS Kinesis streams'
  },
  kpiDefinitions,
  metricDefinitions,

  getLabel(snapshot) {
    return snapshot.getIn(['data', 'kns_stream_name'], '');
  },
  technologyDescriptor: {
    label: 'AWS Kinesis'
  }
});
