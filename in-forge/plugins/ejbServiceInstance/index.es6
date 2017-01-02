import {registerSnapshotDefinition} from 'in-sdk/snapshot';
import {plugins} from 'in-forge/constants';

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
    return snapshot.getIn(['data', 'name']);
  }
});
