import {registerSnapshotDefinition} from 'in-sdk/snapshot';
import iconSvgPath from 'in-sdk/unknownIconPath';
import {plugins} from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';


registerSnapshotDefinition({
  plugin: plugins.ftpServiceInstance,

  iconSvgPath,
  metricDefinitions,

  pluginName: {
    singular: 'FTP Server Instance',
    plural: 'FTP Server Instances'
  },

  chartWiggleRoom: 20000,

  getLabel(snapshot) {
    return snapshot.getIn(['data', 'name']);
  }
});
