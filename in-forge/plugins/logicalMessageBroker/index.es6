import tableDefinition from 'in-forge/plugins/defaultLogicalService/tableDefinition';
import {registerSnapshotDefinition} from 'in-sdk/snapshot';
import {plugins} from 'in-forge/constants';

import icon from './icon.svg';

registerSnapshotDefinition({
  plugin: plugins.logicalMessageBroker,
  icon,
  namesForTypeSearch: ['service'],
  tableDefinition,

  pluginName: {
    singular: 'Logical Message Broker',
    plural: 'Logical Message Brokers'
  },

  chartWiggleRoom: 20000,

  getLabel(snapshot) {
    return snapshot.getIn(['data', 'service_name']);
  }
});
