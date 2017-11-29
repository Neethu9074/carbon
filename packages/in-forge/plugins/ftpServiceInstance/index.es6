import { registerSnapshotDefinition, getLabel } from 'in-sdk/snapshot';
import iconSvgPath from 'in-sdk/unknownIconPath';
import { plugins } from 'in-forge/constants';

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
    const name = snapshot.getIn(['data', 'name'], '');
    if (name.length === 0 || /^PID: \d+/i.test(name)) {
      // label would be shitty, try to find a matching label using the embedded component snapshot
      const component = snapshot.getIn(['embedded', 'component']);
      if (component) {
        return getLabel(component, name);
      }
    }

    return name;
  }
});
