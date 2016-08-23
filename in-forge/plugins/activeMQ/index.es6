import {registerSnapshotDefinition} from 'in-sdk/snapshot';
import {emptyList} from 'in-services/fixedImmutables';
import {plugins} from 'in-forge/constants';

import icon from './icon.svg';

registerSnapshotDefinition({
  plugin: plugins.activemq,
  icon,

  pluginName: {
    singular: 'ActiveMQ',
    plural: 'ActiveMQs'
  },

  namesForTypeSearch: ['activemq'],

  getLabel(snapshot) {
    return '@ ' + snapshot.getIn(['data', 'ports'], emptyList).sort().join(', ');
  }
});
