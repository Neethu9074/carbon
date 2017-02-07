import {registerSnapshotDefinition} from 'in-sdk/snapshot';
import {plugins} from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import iconSvgPath from './iconPath';

registerSnapshotDefinition({
  plugin: plugins.openLDAP,

  iconSvgPath,
  metricDefinitions,

  pluginName: {
    singular: 'OpenLDAP Node',
    plural: 'OpenLDAP Nodes'
  },
  namesForTypeSearch: ['openldap'],

  getLabel() {
    return 'OpenLDAP';
  }
});
