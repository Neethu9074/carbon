import {registerSnapshotDefinition} from 'in-sdk/snapshot';
import {plugins} from 'in-forge/constants';

import icon from 'in-sdk/unknown_icon.svg';

import metricDefinitions from './metricDefinitions';


registerSnapshotDefinition({
  plugin: plugins.ldapServiceInstance,
  icon,
  metricDefinitions,

  pluginName: {
    singular: 'LDAP Service Instance',
    plural: 'LDAP Service Instances'
  },

  chartWiggleRoom: 20000,

  getLabel(snapshot) {
    return snapshot.getIn(['data', 'name']);
  }
});
