import metricDefinitions from 'in-forge/plugins/defaultLogicalService/metricDefinitions';
import tableDefinition from 'in-forge/plugins/defaultLogicalService/tableDefinition';
import {registerSnapshotDefinition} from 'in-sdk/snapshot';
import {plugins} from 'in-forge/constants';

import icon from './icon.svg';

registerSnapshotDefinition({
  plugin: plugins.ldapLogicalService,
  icon,
  namesForTypeSearch: ['service'],
  tableDefinition,
  metricDefinitions,

  pluginName: {
    singular: 'LDAP',
    plural: 'LDAP'
  },

  chartWiggleRoom: 20000,

  getLabel(snapshot) {
    return snapshot.getIn(['data', 'service_name']);
  }
});
