import {registerSnapshotDefinition} from 'in-sdk/snapshot';
import {plugins} from 'in-forge/constants';

import icon from 'in-sdk/unknown_icon.svg';

import metricDefinitions from './metricDefinitions';


registerSnapshotDefinition({
  plugin: plugins.ldapLogicalConnection,
  icon,
  metricDefinitions,
  chartWiggleRoom: 20000,

  pluginName: {
    singular: 'LDAP Connection',
    plural: 'LDAP Connections'
  },

  getLabel(snapshot) {
    return snapshot.getIn(['data', 'source', 'service_name']) +
                ' to ' +
                snapshot.getIn(['data', 'destination', 'service_name']);
  }
});
