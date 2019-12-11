import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';
import kpiDefinitions from 'in-forge/plugins/googleCloudSQL/kpiDefinitions';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.googleCloudSQL,
  iconSvgPath,
  kpiDefinitions,
  metricDefinitions,

  pluginName: {
    singular: 'GCP SQL Instance',
    plural: 'GCP SQL Instances'
  },
  getLabel(snapshot) {
    return snapshot.getIn(['data', 'name'], '');
  }
});
