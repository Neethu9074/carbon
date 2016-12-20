import metricDefinitions from 'in-forge/plugins/defaultLogicalService/metricDefinitions';
import tableDefinition from 'in-forge/plugins/defaultLogicalService/tableDefinition';
import {registerSnapshotDefinition} from 'in-sdk/snapshot';
import {plugins} from 'in-forge/constants';

import icon from './icon.svg';

registerSnapshotDefinition({
  plugin: plugins.ejbLogicalService,
  icon,
  namesForTypeSearch: ['service'],
  tableDefinition,
  metricDefinitions,

  pluginName: {
    singular: 'EJB',
    plural: 'EJBs'
  },

  chartWiggleRoom: 20000,

  getLabel(snapshot) {
    return snapshot.getIn(['data', 'service_name']);
  }
});
