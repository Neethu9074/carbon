import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.awsKinesis,
  iconSvgPath,
  metricDefinitions,

  pluginName: {
    singular: 'AWS Kinesis stream',
    plural: 'AWS Kinesis streams'
  },
  getLabel(snapshot) {
    return snapshot.getIn(['data', 'kns_stream_name'], '');
  }
});
