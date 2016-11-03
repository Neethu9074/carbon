import {registerSnapshotDefinition} from 'in-sdk/snapshot';
import {emptyList} from 'in-services/fixedImmutables';
import {plugins} from 'in-forge/constants';

import metricDefinitions from './metricDefinitions';
import icon from './icon.svg';

registerSnapshotDefinition({
  plugin: plugins.activemq,
  icon,
  metricDefinitions,

  pluginName: {
    singular: 'ActiveMQ',
    plural: 'ActiveMQs'
  },

  namesForTypeSearch: ['activemq'],

  getLabel(snapshot) {
    return '@ ' + snapshot.getIn(['data', 'ports'], emptyList).sort().join(', ');
  }
});
