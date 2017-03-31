import { registerSnapshotDefinition, getLabel } from 'in-sdk/snapshot';
import { plugins } from 'in-forge/constants';

import iconSvgPath from 'in-forge/plugins/ejbLogicalService/iconPath';

import metricDefinitions from './metricDefinitions';

registerSnapshotDefinition({
  plugin: plugins.ejbServiceInstance,

  iconSvgPath,
  metricDefinitions,

  pluginName: {
    singular: 'EJB Instance',
    plural: 'EJB Instances'
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
